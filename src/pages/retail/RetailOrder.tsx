import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { retailConfig } from "@/config/retailConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

const RetailOrder = () => {
  const { items, totalPrice, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Online">("Online");
  const navigate = useNavigate();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    
    try {
      setIsPlacingOrder(true);
      
      // 1. Create Internal Order
      const payload = {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod: paymentMethod
      };
      
      const { data: order } = await api.post("/orders", payload);

      if (paymentMethod === "COD") {
        toast.success("Order placed successfully!");
        clearCart();
        navigate("/retail/orders");
      } else {
        // 2. Handle Online Payment (Razorpay)
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          return;
        }

        // Create Razorpay Order
        const { data: rzpOrder } = await api.post("/payments/order", {
          amount: order.totalAmount,
          receipt: order.orderNumber
        });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: "Retail Connect Pro",
          description: `Order ${order.orderNumber}`,
          order_id: rzpOrder.id,
          handler: async function (response: any) {
            try {
              toast.loading("Verifying payment...");
              await api.post("/payments/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id
              });
              toast.dismiss();
              toast.success("Payment successful! Order confirmed.");
              clearCart();
              navigate("/retail/orders");
            } catch (err) {
              toast.dismiss();
              toast.error("Payment verification failed.");
            }
          },
          prefill: {
            name: "Outlet Owner",
            email: "owner@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#0ea5e9",
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <DashboardLayout role={retailConfig}>
      <div className="space-y-6 max-w-2xl px-4 md:px-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          <p className="text-sm text-muted-foreground">Finalize your items and choose payment method</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-card rounded-3xl border border-border p-12 text-center shadow-sm">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-medium">Your cart is empty</p>
            <Button variant="link" onClick={() => navigate("/retail/products")} className="mt-2 text-primary">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border/50">
              {items.map((item) => (
                <div key={item.productId} className="p-4 flex items-center gap-4 transition-colors hover:bg-muted/10">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">₹{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => decreaseQuantity(item.productId)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => increaseQuantity(item.productId)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="w-20 text-right font-bold text-foreground text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setPaymentMethod("Online")}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'Online' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-border-hover'}`}
                    >
                        <CreditCard size={24} />
                        <span className="text-sm font-bold">Online Pay</span>
                    </button>
                    <button 
                        onClick={() => setPaymentMethod("COD")}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-border-hover'}`}
                    >
                        <Banknote size={24} />
                        <span className="text-sm font-bold">Cash on Delivery</span>
                    </button>
                </div>
            </div>

            <div className="bg-primary/5 rounded-3xl border border-primary/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs text-primary/60 font-semibold uppercase tracking-widest">Grand Total</p>
                <p className="text-3xl font-black text-primary">₹{totalPrice.toLocaleString()}</p>
              </div>
              <Button size="lg" className="h-14 px-10 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 gap-3 w-full sm:w-auto" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                {isPlacingOrder ? <Loader2 className="animate-spin" /> : <ShoppingCart className="h-5 w-5" />} 
                {paymentMethod === "Online" ? "Proceed to Pay" : "Place COD Order"}
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RetailOrder;
