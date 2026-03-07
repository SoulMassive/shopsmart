import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Plus, Minus, Tag, Weight, Package, FlaskConical, Loader2 } from "lucide-react";
import { useBrandTheme } from "@/context/BrandThemeContext";
import Header from "@/components/shop/Header";
import ShopFooter from "@/components/shop/ShopFooter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import api from "@/lib/api";

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { theme } = useBrandTheme();
    const { addToCart, increaseQuantity, decreaseQuantity } = useCart();
    const [qty, setQty] = useState(0);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const { data } = await api.get(`/products/${id}`);
            return data;
        },
        enabled: !!id,
    });

    const handleIncrease = () => {
        if (!product) return;
        if (qty === 0) {
            addToCart({ 
                productId: product._id, 
                name: product.name, 
                price: product.discountedPrice, 
                image: product.images?.[0],
                weight: product.weight,
                weightInKg: product.weightInKg,
            });
            toast.success(`${product.name} added to cart!`);
        } else {
            increaseQuantity(product._id);
        }
        setQty((q) => q + 1);
    };

    const handleDecrease = () => {
        if (!product || qty === 0) return;
        decreaseQuantity(product._id);
        setQty((q) => Math.max(0, q - 1));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primary }} />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
                <p className="text-gray-500">Product not found.</p>
                <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    const weightLabel = product.weight
        ? product.weight >= 1000
            ? `${product.weight / 1000}kg`
            : `${product.weight}g`
        : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Breadcrumb bar */}
            <div className="py-4 px-4" style={{ background: theme.gradient }}>
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0"
                >
                    {/* Image */}
                    <div
                        className="flex items-center justify-center min-h-72 p-6"
                        style={{ background: theme.bgLight }}
                    >
                        {product.images?.[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="max-h-72 w-full object-contain rounded-xl"
                            />
                        ) : (
                            <span className="text-[100px]">🌾</span>
                        )}
                        {/* Discount Badge */}
                        {product.discountPercentage > 0 && (
                            <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm px-3 py-1.5 rounded shadow-sm font-bold tracking-wide">
                                {product.discountPercentage}% OFF
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-8 flex flex-col gap-5">
                        {/* Brand tag */}
                        {product.brandId?.name && (
                            <span
                                className="text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full self-start"
                                style={{ background: theme.secondary, color: theme.accent }}
                            >
                                {product.brandId.name}
                            </span>
                        )}

                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

                        {product.description && (
                            <p className="text-gray-500 text-sm leading-relaxed">{product.description}</p>
                        )}

                        {/* Quick stats pills */}
                        <div className="flex flex-wrap gap-2">
                            {weightLabel && (
                                <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                    <Weight className="h-3.5 w-3.5" /> {weightLabel}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                <Package className="h-3.5 w-3.5" /> {product.stock} in stock
                            </span>
                            {product.sku && (
                                <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                    <Tag className="h-3.5 w-3.5" /> {product.sku}
                                </span>
                            )}
                        </div>

                        {/* Ingredients */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                <FlaskConical className="h-3.5 w-3.5" /> Ingredients
                            </p>
                            <p className="text-sm text-gray-700">{product.ingredients || "—"}</p>
                        </div>

                        {/* Storage Conditions */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                <Package className="h-3.5 w-3.5" /> Storage Conditions
                            </p>
                            <p className="text-sm text-gray-700">{product.storageConditions || "—"}</p>
                        </div>

                        {/* Health Benefits */}
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                                <Tag className="h-3.5 w-3.5" /> Health Benefits
                            </p>
                            <p className="text-sm text-gray-700">{product.healthBenefits || "—"}</p>
                        </div>

                        {/* Price + Qty Controls */}
                        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-gray-400 line-through text-sm font-medium">₹{product.originalPrice?.toLocaleString()}</span>
                                <span className="text-3xl font-bold text-green-600 leading-none mt-1">₹{product.discountedPrice?.toLocaleString()}</span>
                            </div>

                            {product.stock === 0 ? (
                                <span className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-gray-100">
                                    Out of Stock
                                </span>
                            ) : qty === 0 ? (
                                <button
                                    onClick={handleIncrease}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
                                    style={{ background: theme.gradient }}
                                >
                                    <Plus className="h-4 w-4" /> Add to Cart
                                </button>
                            ) : (
                                <div
                                    className="flex items-center rounded-xl overflow-hidden border-2"
                                    style={{ borderColor: theme.primary }}
                                >
                                    <button
                                        onClick={handleDecrease}
                                        className="px-4 py-2.5 flex items-center justify-center hover:opacity-80 transition-opacity"
                                        style={{ background: theme.secondary }}
                                    >
                                        <Minus className="h-4 w-4" style={{ color: theme.accent }} />
                                    </button>
                                    <span
                                        className="px-5 text-base font-bold min-w-[2.5rem] text-center"
                                        style={{ color: theme.accent }}
                                    >
                                        {qty}
                                    </span>
                                    <button
                                        onClick={handleIncrease}
                                        className="px-4 py-2.5 flex items-center justify-center hover:opacity-80 transition-opacity"
                                        style={{ background: theme.secondary }}
                                    >
                                        <Plus className="h-4 w-4" style={{ color: theme.accent }} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <ShopFooter />
        </div>
    );
};

export default ProductDetailPage;
