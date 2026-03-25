import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrandTheme } from "@/context/BrandThemeContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        originalPrice: number;
        discountedPrice: number;
        discountPercentage: number;
        category?: string;
        stock: number;
        weight?: number;
        weightInKg?: number;
        images?: string[];
    };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { theme } = useBrandTheme();
    const navigate = useNavigate();
    const { addToCart, increaseQuantity, decreaseQuantity } = useCart();
    const [qty, setQty] = useState(0);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent card navigation
        addToCart({
            productId: product._id,
            name: product.name,
            price: product.discountedPrice,
            image: product.images?.[0],
            weight: product.weight,
            weightInKg: product.weightInKg,
        });
        toast.success(`${product.name} added to cart!`);
        setQty(1);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        increaseQuantity(product._id);
        setQty((q) => q + 1);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        decreaseQuantity(product._id);
        setQty((q) => Math.max(0, q - 1));
    };

    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col cursor-pointer"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
            onClick={() => navigate(`/product/${product._id}`)}
        >
            {/* Product image */}
            <div
                className="w-full h-36 flex items-center justify-center overflow-hidden relative"
                style={{ background: theme.bgLight }}
            >
                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-sm font-bold tracking-wide">
                        {product.discountPercentage}% OFF
                    </div>
                )}
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                    />
                ) : (
                    <span className="text-5xl">🌾</span>
                )}
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                        {product.name}
                    </h3>
                    {product.weight && (
                        <span className="text-[11px] text-gray-400 mt-0.5 block">
                            {product.weight >= 1000 ? `${product.weight / 1000}kg` : `${product.weight}g`}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        {product.discountPercentage > 0 && (
                            <span className="text-gray-400 line-through text-xs font-medium">₹{product.originalPrice?.toLocaleString()}</span>
                        )}
                        <span className="text-lg font-bold text-green-600 leading-none mt-0.5">₹{product.discountedPrice?.toLocaleString()}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{product.stock} units</span>
                </div>

                {/* Cart controls — stop propagation so clicks don't navigate */}
                {qty === 0 ? (
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={handleAdd}
                        disabled={product.stock === 0}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: theme.gradient }}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </motion.button>
                ) : (
                    <div
                        className="flex items-center justify-between rounded-xl overflow-hidden border"
                        style={{ borderColor: theme.primary }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleDecrease}
                            className="flex-1 py-2 flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{ background: theme.secondary }}
                        >
                            <Minus className="h-4 w-4" style={{ color: theme.accent }} />
                        </button>
                        <span className="flex-1 text-center text-sm font-bold" style={{ color: theme.accent }}>
                            {qty}
                        </span>
                        <button
                            onClick={handleIncrease}
                            className="flex-1 py-2 flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{ background: theme.secondary }}
                        >
                            <Plus className="h-4 w-4" style={{ color: theme.accent }} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
