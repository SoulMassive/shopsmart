import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { retailConfig } from "@/config/retailConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

const RetailOrder = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const updateQty = (id: string, delta: number) => {
    setCart((c) =>
      c.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
    );
  };

  const remove = (id: string) => setCart((c) => c.filter((item) => item.id !== id));
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <DashboardLayout role={retailConfig}>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Place Order</h1>
          <p className="text-sm text-muted-foreground">Review your cart and submit your order</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-10 text-center shadow-card">
            <ShoppingCart className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-card divide-y divide-border">
            {cart.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, -1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    className="w-14 h-8 text-center text-sm"
                    value={item.qty}
                    readOnly
                  />
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="w-24 text-right font-semibold text-card-foreground">₹{(item.price * item.qty).toLocaleString()}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-5 shadow-card flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order Total</p>
              <p className="text-2xl font-bold text-card-foreground">₹{total.toLocaleString()}</p>
            </div>
            <Button size="lg" className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Place Order
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RetailOrder;
