import React, { createContext, useContext, useReducer, useEffect } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    unit?: string;
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: "ADD_TO_CART"; payload: Omit<CartItem, "quantity"> }
    | { type: "REMOVE_FROM_CART"; payload: string }
    | { type: "INCREASE_QTY"; payload: string }
    | { type: "DECREASE_QTY"; payload: string }
    | { type: "CLEAR_CART" };

interface CartContextType extends CartState {
    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

// ── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existing = state.items.find((i) => i.productId === action.payload.productId);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.productId === action.payload.productId ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case "REMOVE_FROM_CART":
            return { items: state.items.filter((i) => i.productId !== action.payload) };
        case "INCREASE_QTY":
            return {
                items: state.items.map((i) =>
                    i.productId === action.payload ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        case "DECREASE_QTY":
            return {
                items: state.items
                    .map((i) =>
                        i.productId === action.payload ? { ...i, quantity: i.quantity - 1 } : i
                    )
                    .filter((i) => i.quantity > 0),
            };
        case "CLEAR_CART":
            return { items: [] };
        default:
            return state;
    }
}

// ── Persistence helpers ───────────────────────────────────────────────────────
const STORAGE_KEY = "shopsmart_cart";

function loadFromStorage(): CartState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? { items: JSON.parse(raw) } : { items: [] };
    } catch {
        return { items: [] };
    }
}

function saveToStorage(state: CartState) {
    try {
        // Strip base64 images before persisting — they can be several MB each
        // and will blow past the 5 MB localStorage quota.
        const slim = state.items.map(({ image: _image, ...rest }) => rest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
    } catch {
        // Quota exceeded — silently swallow; cart still works in-memory
    }
}

// ── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

    // Persist to localStorage on every change
    useEffect(() => {
        saveToStorage(state);
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
    const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
