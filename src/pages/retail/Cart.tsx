import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { retailConfig } from "@/config/retailConfig";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const Cart = () => {
    const navigate = useNavigate();
    const { items, totalItems, totalPrice, totalWeightKg, clearCart } = useCart();
    const { user } = useAuth();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Fetch outlet to get address
    const { data: outlet } = useQuery({
        queryKey: ["myOutlet"],
        queryFn: async () => {
            const { data } = await api.get("/outlets/mine");
            return data;
        },
        retry: false,
    });

    // First Order Offer Logic
    const isEligible = user && user.hasUsedFirstOrderOffer !== true;
    const isOfferApplied = isEligible && totalWeightKg >= 15;
    const finalTotal = isOfferApplied ? totalPrice * 0.5 : totalPrice;
    const discountAmount = isOfferApplied ? totalPrice * 0.5 : 0;

    const handleCheckout = async () => {
        if (items.length === 0) return;
        try {
            setIsCheckingOut(true);
            const payload = {
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                shippingAddress: outlet?.address,
                paymentMethod: "COD"
            };
            await api.post("/orders", payload);
            toast.success("Order placed successfully!");
            clearCart();
            // Using window.location to force reload User profile from context to update hasUsedFirstOrderOffer flag automatically
            setTimeout(() => window.location.href = "/retail/orders", 1000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to place order.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <DashboardLayout role={retailConfig}>
            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Your Cart</h1>
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
                        onClick={() => navigate("/retail/products")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </div>

                {items.length === 0 ? (
                    /* Empty state */
                    <div className="bg-card rounded-2xl border border-border p-16 flex flex-col items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <ShoppingCart className="h-9 w-9 text-muted-foreground/40" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-foreground">Your cart is empty</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Browse products and click <strong>Add to Cart</strong> to get started.
                            </p>
                        </div>
                        <Button onClick={() => navigate("/retail/products")} className="mt-2">
                            Browse Products
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Offer Banners */}
                        {isEligible && (
                            <div className="mb-4">
                                {isOfferApplied ? (
                                    <div className="bg-green-100 border border-green-300 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                        <h3 className="text-green-800 font-bold text-lg mb-1">🎉 First Order Offer Applied!</h3>
                                        <p className="text-green-700 text-sm">
                                            You are eligible for a <strong>50% discount</strong> because your cart contains more than 15kg of products.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
                                        <h3 className="text-orange-800 font-semibold mb-1">Unlock 50% First Order Discount</h3>
                                        <p className="text-orange-700 text-sm">
                                            Add <strong>{(15 - totalWeightKg).toFixed(1)}kg</strong> more products to unlock your 🎉 50% First Order Discount!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

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

                            <div className="border-t border-border pt-3 space-y-2">
                                <div className="flex justify-between font-semibold text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Total Weight</span>
                                    <span>{totalWeightKg.toFixed(2)}kg</span>
                                </div>

                                {isOfferApplied && (
                                    <div className="flex justify-between font-bold text-green-600 bg-green-50 p-2 rounded-lg mt-2">
                                        <span>🎉 First Order Offer (50% OFF)</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-border">
                                    <span>Final Total</span>
                                    <span className="text-primary">₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {(!outlet?.address || !outlet.address.street || !outlet.address.city || !outlet.address.state || !outlet.address.zipCode) && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex flex-col items-center gap-3 text-center">
                                    <p className="text-destructive text-sm font-medium">
                                        Please complete your outlet address in Profile Settings before placing an order.
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-primary border-primary/30 hover:bg-primary/5"
                                        onClick={() => navigate("/retail/profile")}
                                    >
                                        Go to Profile Settings
                                    </Button>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                <Button
                                    disabled={isCheckingOut || !outlet?.address || !outlet.address.street || !outlet.address.city || !outlet.address.state || !outlet.address.zipCode}
                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 gap-2 py-5 text-base font-semibold"
                                    onClick={handleCheckout}
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    {isCheckingOut ? "Placing Order..." : "Place Order"}
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

export default Cart;
