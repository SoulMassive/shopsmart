import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrandTheme } from "@/context/BrandThemeContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductVariant {
    _id: string;
    weight: number;
    weightInKg: number;
    price: number;
    originalPrice: number;
    discountedPrice: number;
    discountPercentage: number;
    stock: number;
    label?: string;
}

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
        variants?: ProductVariant[];
    };
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { theme } = useBrandTheme();
    const navigate = useNavigate();
    const { addToCart, increaseQuantity, decreaseQuantity, items } = useCart();
    
    // Select the first variant by default if variants exist, otherwise use the base product
    const [selectedVariantId, setSelectedVariantId] = useState(
        product.variants && product.variants.length > 0 ? product.variants[0]._id : product._id
    );

    const activeProduct = product.variants 
        ? product.variants.find(v => v._id === selectedVariantId) || product.variants[0]
        : product;

    // Get qty from cart
    const cartItem = items.find(item => item.productId === activeProduct._id);
    const qty = cartItem ? cartItem.quantity : 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent card navigation
        addToCart({
            productId: activeProduct._id,
            name: product.variants ? `${product.name} - ${(activeProduct as ProductVariant).label}` : product.name,
            price: activeProduct.discountedPrice,
            image: product.images?.[0],
            weight: activeProduct.weight,
            weightInKg: activeProduct.weightInKg,
        });
        toast.success(`Item added to cart!`);
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        increaseQuantity(activeProduct._id);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        decreaseQuantity(activeProduct._id);
    };

    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col cursor-pointer shadow-sm"
            onClick={() => navigate(`/product/${product._id}`)}
        >
            {/* Product image (Fixed 1:1 ratio) */}
            <div
                className="w-full aspect-square flex items-center justify-center overflow-hidden relative"
                style={{ background: theme.bgLight }}
            >
                {/* Discount Badge */}
                {activeProduct.discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-sm font-bold tracking-wide">
                        {activeProduct.discountPercentage}% OFF
                    </div>
                )}
                {product.images?.[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl">🌾</span>
                )}
            </div>

            <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2" title={product.name}>
                        {product.name}
                    </h3>
                    
                    {/* Variants Dropdown or Weight Label */}
                    {product.variants && product.variants.length > 0 ? (
                        <select 
                            className="mt-2 w-full text-xs border border-gray-200 rounded p-1 focus:outline-none focus:border-gray-400"
                            value={selectedVariantId}
                            onChange={(e) => {
                                e.stopPropagation();
                                setSelectedVariantId(e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {product.variants.map((v) => (
                                <option key={v._id} value={v._id}>{v.label}</option>
                            ))}
                        </select>
                    ) : (
                        product.weight && (
                            <span className="text-[11px] text-gray-400 mt-0.5 block">
                                {product.weight >= 1000 ? `${product.weight / 1000}kg` : `${product.weight}g`}
                            </span>
                        )
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex flex-col">
                        {activeProduct.discountPercentage > 0 && (
                            <span className="text-gray-400 line-through text-xs font-medium">₹{activeProduct.originalPrice?.toLocaleString()}</span>
                        )}
                        <span className="text-lg font-bold text-green-600 leading-none mt-0.5">₹{activeProduct.discountedPrice?.toLocaleString()}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{activeProduct.stock} units</span>
                </div>

                {/* Cart controls */}
                {qty === 0 ? (
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={handleAdd}
                        disabled={activeProduct.stock === 0}
                        className="flex items-center justify-center gap-2 w-full py-2.5 mt-1 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: theme.gradient }}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {activeProduct.stock === 0 ? "Out of Stock" : "Add"}
                    </motion.button>
                ) : (
                    <div
                        className="flex items-center justify-between rounded-xl overflow-hidden border mt-1"
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
