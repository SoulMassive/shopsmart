import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { adminConfig } from "@/config/adminConfig";

const AdminCart = () => {
    const navigate = useNavigate();
    const { items, totalItems, totalPrice, clearCart } = useCart();

    const handleCheckout = () => {
        if (items.length === 0) return;
        console.log("🛒 Checkout payload:", { items, totalItems, totalPrice });
        toast.success("Order placed! (Demo mode)");
    };

    return (
        <DashboardLayout role={adminConfig}>
            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Cart</h1>
                        <p className="text-sm text-muted-foreground">
                            {totalItems > 0
                                ? `${totalItems} item${totalItems > 1 ? "s" : ""} ready to order`
                                : "Your cart is empty"}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </div>

                {items.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-16 flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingCart className="h-9 w-9 text-muted-foreground/40" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-foreground">Your cart is empty</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Browse products from the shop and click <strong>Add to Cart</strong>.
                            </p>
                        </div>
                        <Button onClick={() => navigate("/")} className="mt-2">
                            Browse Products
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Cart items */}
                        <div className="bg-card rounded-2xl border border-border shadow-card px-6">
                            {items.map((item) => (
                                <CartItem key={item.productId} item={item} />
                            ))}
                        </div>

                        {/* Order summary */}
                        <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
                            <h2 className="font-semibold text-foreground">Order Summary</h2>

                            <div className="space-y-2 text-sm">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex justify-between text-muted-foreground">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>₹{((item.price || 0) * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <Button
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 gap-2 py-5 text-base font-semibold"
                                    onClick={handleCheckout}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Place Order
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 text-destructive hover:bg-destructive/10 border-destructive/30"
                                    onClick={() => { clearCart(); toast.info("Cart cleared."); }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminCart;
