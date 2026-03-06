import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useBrandTheme } from "@/context/BrandThemeContext";

interface ProductCardProps {
    product: {
        _id: string;
        name: string;
        price: number;
        category: string;
        stock: number;
        images?: string[];
    };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { theme } = useBrandTheme();
    const [qty, setQty] = useState(0);

    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
            {/* Product image placeholder */}
            <div
                className="w-full h-36 flex items-center justify-center text-5xl"
                style={{ background: theme.bgLight }}
            >
                🌾
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: theme.primary }}>
                        {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-800 mt-0.5 leading-snug line-clamp-2">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-base font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-[11px] text-gray-400">{product.stock} units</span>
                </div>

                {/* Quantity selector + Add to cart */}
                {qty === 0 ? (
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setQty(1)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{ background: theme.gradient }}
                    >
                        <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </motion.button>
                ) : (
                    <div className="flex items-center justify-between rounded-xl overflow-hidden border"
                        style={{ borderColor: theme.primary }}>
                        <button
                            onClick={() => setQty((q) => Math.max(0, q - 1))}
                            className="flex-1 py-2 flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{ background: theme.secondary }}
                        >
                            <Minus className="h-4 w-4" style={{ color: theme.accent }} />
                        </button>
                        <span className="flex-1 text-center text-sm font-bold" style={{ color: theme.accent }}>
                            {qty}
                        </span>
                        <button
                            onClick={() => setQty((q) => q + 1)}
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
