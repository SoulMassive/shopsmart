import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
    const subtotal = item.price * item.quantity;

    return (
        <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
            {/* Product image */}
            <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                    <span className="text-2xl">🛍️</span>
                )}
            </div>

            {/* Name + unit */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-card-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">₹{item.price.toLocaleString()} {item.unit ? `/ ${item.unit}` : "each"}</p>
            </div>

            {/* Qty controls */}
            <div className="flex items-center gap-1.5">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => decreaseQuantity(item.productId)}
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => increaseQuantity(item.productId)}
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>

            {/* Subtotal */}
            <p className="w-24 text-right font-bold text-card-foreground">
                ₹{subtotal.toLocaleString()}
            </p>

            {/* Remove */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => removeFromCart(item.productId)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
