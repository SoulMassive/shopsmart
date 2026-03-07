import React, { createContext, useContext, useReducer, useEffect } from "react";
import { get, set } from "idb-keyval";

// ── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    unit?: string;
    weightInKg?: number;
    weight?: number; // fallback grams
}

interface CartState {
    items: CartItem[];
    isLoaded: boolean;
}

type CartAction =
    | { type: "ADD_TO_CART"; payload: Omit<CartItem, "quantity"> }
    | { type: "REMOVE_FROM_CART"; payload: string }
    | { type: "INCREASE_QTY"; payload: string }
    | { type: "DECREASE_QTY"; payload: string }
    | { type: "CLEAR_CART" }
    | { type: "SET_CART"; payload: CartItem[] };

interface CartContextType extends CartState {
    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    totalWeightKg: number;
}

// ── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existing = state.items.find((i) => i.productId === action.payload.productId);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.productId === action.payload.productId ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case "REMOVE_FROM_CART":
            return { ...state, items: state.items.filter((i) => i.productId !== action.payload) };
        case "INCREASE_QTY":
            return {
                ...state,
                items: state.items.map((i) =>
                    i.productId === action.payload ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        case "DECREASE_QTY":
            return {
                ...state,
                items: state.items
                    .map((i) =>
                        i.productId === action.payload ? { ...i, quantity: i.quantity - 1 } : i
                    )
                    .filter((i) => i.quantity > 0),
            };
        case "CLEAR_CART":
            return { ...state, items: [] };
        case "SET_CART":
            return { ...state, items: action.payload, isLoaded: true };
        default:
            return state;
    }
}

// ── Persistence helpers ───────────────────────────────────────────────────────
const STORAGE_KEY = "shopsmart_cart_v3"; // Bump to v3 for IDB migration

// ── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], isLoaded: false });

    // Load from IndexedDB on mount
    useEffect(() => {
        get<CartItem[]>(STORAGE_KEY).then((items) => {
            dispatch({ type: "SET_CART", payload: items || [] });
        }).catch((err) => {
            console.error("Failed to load cart from IndexedDB:", err);
            dispatch({ type: "SET_CART", payload: [] });
        });
    }, []);

    // Persist to IndexedDB on every change (if loaded)
    useEffect(() => {
        if (state.isLoaded) {
            set(STORAGE_KEY, state.items).catch((err) => {
                console.error("Cart save failed to IndexedDB:", err);
            });
        }
    }, [state]);

    // Clear cart on logout
    useEffect(() => {
        const handleLogout = () => {
            dispatch({ type: "CLEAR_CART" });
        };
        window.addEventListener("auth-logout", handleLogout);
        return () => window.removeEventListener("auth-logout", handleLogout);
    }, []);

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    const totalWeightKg = state.items.reduce((sum, i) => {
        const itemWeight = i.weightInKg || ((i.weight || 0) / 1000) || 0;
        return sum + itemWeight * i.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                ...state,
                addToCart: (p) => dispatch({ type: "ADD_TO_CART", payload: p }),
                removeFromCart: (id) => dispatch({ type: "REMOVE_FROM_CART", payload: id }),
                increaseQuantity: (id) => dispatch({ type: "INCREASE_QTY", payload: id }),
                decreaseQuantity: (id) => dispatch({ type: "DECREASE_QTY", payload: id }),
                clearCart: () => dispatch({ type: "CLEAR_CART" }),
                totalItems,
                totalPrice,
                totalWeightKg,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
};
