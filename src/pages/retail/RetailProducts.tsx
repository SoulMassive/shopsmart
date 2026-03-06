import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { retailConfig } from "@/config/retailConfig";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Tag, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const RetailProducts = () => {
  const [filter, setFilter] = useState("All");
  const { addToCart, items } = useCart();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", filter],
    queryFn: async () => {
      const params = filter !== "All" ? { category: filter } : {};
      const { data } = await api.get("/products", { params });
      return data.products;
    },
  });

  const categories = ["All", "SRR", "JayaJanardhana", "MilletsPro"];

  return (
    <DashboardLayout role={retailConfig}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">Browse and order products from your brands</p>
        </div>

        {/* Brand filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <Button
              key={c}
              variant={filter === c ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Error loading products. Please try again.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data || []).map((p: any) => (
              <div key={p._id} className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">₹{p.price}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Stock: {p.stock} units</p>
                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    addToCart({
                      productId: p._id,
                      name: p.name,
                      price: p.price,
                      image: p.images?.[0] || "",
                      unit: p.unit || "piece",
                    });
                    const already = items.some((i) => i.productId === p._id);
                    toast.success(
                      already
                        ? `Added another ${p.name} to cart`
                        : `${p.name} added to cart!`,
                      { icon: "🛒" }
                    );
                  }}
                >
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RetailProducts;
