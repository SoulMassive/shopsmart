import React, { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ImagePlus, X } from "lucide-react";
import api from "@/lib/api";

interface AddProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const WEIGHT_OPTIONS = ["250", "500", "750", "1000", "2000"];

const EMPTY_FORM = {
    name: "",
    brandId: "",
    description: "",
    ingredients: "",
    storageConditions: "",
    healthBenefits: "",
    weight: "",
    originalPrice: "",
    discountPercentage: "0",
    stock: "",
};

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onOpenChange }) => {
    const queryClient = useQueryClient();
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── Brand dropdown ────────────────────────────────────────────────────────
    const { data: brands = [] } = useQuery({
        queryKey: ["adminBrands"],
        queryFn: async () => (await api.get("/admin/brands")).data,
        enabled: open,
    });

    // ── Mutation — convert image to base64, send as JSON ────────────────────────
    const mutation = useMutation({
        mutationFn: async () => {
            let imageData: string | undefined;
            if (imageFile) {
                // Compress image to max 800×800 at 70% JPEG quality before base64 encoding
                imageData = await new Promise<string>((resolve, reject) => {
                    const img = new Image();
                    const url = URL.createObjectURL(imageFile);
                    img.onload = () => {
                        const MAX = 800;
                        let { width, height } = img;
                        if (width > MAX || height > MAX) {
                            if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
                            else { width = Math.round(width * MAX / height); height = MAX; }
                        }
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
                        URL.revokeObjectURL(url);
                        resolve(canvas.toDataURL('image/jpeg', 0.7));
                    };
                    img.onerror = reject;
                    img.src = url;
                });
            }
            const payload = {
                ...form,
                originalPrice: parseFloat(form.originalPrice),
                discountPercentage: form.discountPercentage ? parseFloat(form.discountPercentage) : 0,
                stock: form.stock ? parseInt(form.stock) : 0,
                weight: form.weight && form.weight !== "none" ? parseInt(form.weight) : undefined,
                imageData
            };
            return (await api.post("/admin/products", payload)).data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product added successfully!");
            reset();
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create product");
        },
    });

    // ── Validation ──────────────────────────────────────────────────────────────
    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Product name is required";
        if (!form.brandId) e.brandId = "Brand is required";
        if (!form.originalPrice || parseFloat(form.originalPrice) <= 0) e.originalPrice = "Original Price must be > 0";
        if (form.stock !== "" && parseInt(form.stock) < 0) e.stock = "Stock cannot be negative";
        if (form.description.length > 150) e.description = "Max 150 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) mutation.mutate();
    };

    const set = (field: keyof typeof form, value: string) => {
        setForm((p) => ({ ...p, [field]: value }));
        if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const reset = () => {
        setForm(EMPTY_FORM);
        setErrors({});
        clearImage();
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
            <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 py-2">

                    {/* Product Name */}
                    <div className="space-y-1.5">
                        <Label htmlFor="p-name">Product Name <span className="text-destructive">*</span></Label>
                        <Input id="p-name" placeholder="e.g. Ragi Flour" value={form.name}
                            onChange={(e) => set("name", e.target.value)} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    {/* Brand */}
                    <div className="space-y-1.5">
                        <Label>Brand <span className="text-destructive">*</span></Label>
                        <Select value={form.brandId} onValueChange={(v) => set("brandId", v)}>
                            <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                            <SelectContent>
                                {brands.map((b: any) => <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {errors.brandId && <p className="text-xs text-destructive">{errors.brandId}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <Label htmlFor="p-desc">
                            Description
                            <span className="text-muted-foreground text-xs ml-2">({form.description.length}/150)</span>
                        </Label>
                        <Textarea id="p-desc" placeholder="Short product description..." rows={2}
                            maxLength={150} value={form.description}
                            onChange={(e) => set("description", e.target.value)} />
                        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                    </div>

                    {/* Ingredients */}
                    <div className="space-y-1.5">
                        <Label htmlFor="p-ing">Ingredients</Label>
                        <Textarea id="p-ing" placeholder="e.g. Ragi millet, natural preservatives" rows={2}
                            value={form.ingredients} onChange={(e) => set("ingredients", e.target.value)} />
                    </div>

                    {/* Storage Conditions & Health Benefits */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="p-storage">Storage Conditions</Label>
                            <Input id="p-storage" placeholder="e.g. Cool, dry place"
                                value={form.storageConditions} onChange={(e) => set("storageConditions", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="p-health">Health Benefits</Label>
                            <Input id="p-health" placeholder="e.g. Rich in fiber"
                                value={form.healthBenefits} onChange={(e) => set("healthBenefits", e.target.value)} />
                        </div>
                    </div>

                    {/* Weight + Price + Stock (4-column) */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <Label>Weight <span className="text-muted-foreground text-xs ml-1">(Opt.)</span></Label>
                            <Select value={form.weight} onValueChange={(v) => set("weight", v)}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {WEIGHT_OPTIONS.map((w) => (
                                        <SelectItem key={w} value={w}>
                                            {parseInt(w) >= 1000 ? `${parseInt(w) / 1000}kg` : `${w}g`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="p-price">Orig. Price <span className="text-destructive">*</span></Label>
                            <Input id="p-price" type="number" placeholder="0.00" min="0.01" step="0.01"
                                value={form.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} />
                            {errors.originalPrice && <p className="text-xs text-destructive">{errors.originalPrice}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="p-disc">Discount %</Label>
                            <Input id="p-disc" type="number" placeholder="33.33" min="0" max="100" step="0.1"
                                value={form.discountPercentage} onChange={(e) => set("discountPercentage", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="p-stock">Stock <span className="text-destructive">*</span></Label>
                            <Input id="p-stock" type="number" placeholder="0" min="0"
                                value={form.stock} onChange={(e) => set("stock", e.target.value)} />
                            {errors.stock && <p className="text-xs text-destructive">{errors.stock}</p>}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-1.5">
                        <Label>
                            Product Image
                            <span className="text-muted-foreground text-xs ml-2">(Optional · JPG, PNG, WebP · max 5 MB)</span>
                        </Label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpg,image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        {imagePreview ? (
                            <div className="relative w-full h-36 rounded-xl overflow-hidden border border-border group">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-28 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground"
                            >
                                <ImagePlus className="h-6 w-6" />
                                <span className="text-sm">Click to upload image</span>
                            </button>
                        )}
                        {imagePreview && (
                            <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground"
                                onClick={() => fileInputRef.current?.click()}>
                                Change image
                            </Button>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="pt-2 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={mutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white gap-2">
                            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            Add Product
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductModal;
