import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { adminConfig } from "@/config/adminConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Loader2, Pencil, Trash2, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import AddProductModal from "@/components/admin/AddProductModal";

// ── Inline Edit Modal ─────────────────────────────────────────────────────────
const EditProductModal = ({
  product,
  onClose,
}: {
  product: any;
  onClose: () => void;
}) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: product.name || "",
    originalPrice: String(product.originalPrice || ""),
    discountPercentage: String(product.discountPercentage || "33.33"),
    stock: String(product.stock || ""),
    description: product.description || "",
    ingredients: product.ingredients || "",
    storageConditions: product.storageConditions || "",
    healthBenefits: product.healthBenefits || "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return (
        await api.patch(`/admin/products/${product._id}`, {
          name: form.name,
          originalPrice: parseFloat(form.originalPrice),
          discountPercentage: parseFloat(form.discountPercentage),
          stock: parseInt(form.stock),
          description: form.description,
          ingredients: form.ingredients,
          storageConditions: form.storageConditions,
          healthBenefits: form.healthBenefits,
        })
      ).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Update failed");
    },
  });

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Product Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Original Price (₹)</Label>
              <Input type="number" min="0.01" step="0.01" value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Discount %</Label>
              <Input type="number" min="0" max="100" step="0.1" value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Stock</Label>
              <Input type="number" min="0" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Ingredients</Label>
            <Input value={form.ingredients} placeholder="e.g. Ragi millet, salt..."
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Storage Conditions</Label>
            <Input value={form.storageConditions} placeholder="e.g. Store in a cool, dry place"
              onChange={(e) => setForm({ ...form, storageConditions: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Health Benefits</Label>
            <Input value={form.healthBenefits} placeholder="e.g. Rich in fiber, gluten-free"
              onChange={(e) => setForm({ ...form, healthBenefits: e.target.value })} />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white gap-2">
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get("/admin/products");
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Delete failed");
    },
  });

  return (
    <DashboardLayout role={adminConfig}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
            <p className="text-sm text-muted-foreground">Manage brands, products, and pricing</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => setIsAddOpen(true)}>
            <Plus size={16} /> Add Product
          </Button>
        </div>

        {/* Modals */}
        <AddProductModal open={isAddOpen} onOpenChange={setIsAddOpen} />
        {editProduct && (
          <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} />
        )}
        <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{deleteTarget?.name}</strong>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                onClick={() => deleteMutation.mutate(deleteTarget._id)}
              >
                {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">Error loading products. Please try again.</div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground w-16">Image</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Product</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Brand</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Weight</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Original Price</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Discount Price</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Discount %</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Stock</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(data || []).length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground">
                        <PackageOpen className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        No products yet. Click <strong>+ Add Product</strong> to get started.
                      </td>
                    </tr>
                  ) : (
                    (data || []).map((product: any) => (
                      <tr key={product._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        {/* Thumbnail */}
                        <td className="px-5 py-3">
                          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center text-xl">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                            ) : "🌾"}
                          </div>
                        </td>
                        <td className="px-5 py-3 font-medium text-card-foreground max-w-[180px] truncate">{product.name}</td>
                        <td className="px-5 py-3 text-muted-foreground">{product.brandId?.name || "—"}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {product.weight
                            ? product.weight >= 1000
                              ? `${product.weight / 1000}kg`
                              : `${product.weight}g`
                            : "—"}
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-500 line-through">₹{product.originalPrice?.toLocaleString()}</td>
                        <td className="px-5 py-3 font-bold text-green-600">₹{product.discountedPrice?.toLocaleString()}</td>
                        <td className="px-5 py-3 text-muted-foreground">{product.discountPercentage}%</td>
                        <td className="px-5 py-3 text-muted-foreground">{product.stock}</td>
                        <td className="px-5 py-3">
                          <StatusBadge status={product.isActive ? "Active" : "Inactive"} />
                        </td>
                        {/* CRUD Actions */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => setEditProduct(product)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:border-destructive/50"
                              onClick={() => setDeleteTarget(product)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminProducts;
