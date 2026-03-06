import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useBrandTheme, brandThemes, BrandKey } from "@/context/BrandThemeContext";
import Header from "@/components/shop/Header";
import ShopFooter from "@/components/shop/ShopFooter";
import ProductCard from "@/components/shop/ProductCard";
import api from "@/lib/api";

// Map URL slug → brand key
const slugToKey: Record<string, BrandKey> = {
    "jaya-janardhana": "jaya",
    "ssr": "ssr",
    "millets-pro": "millets",
};

// Map brand key → API category name
const keyToCategory: Record<BrandKey, string> = {
    jaya: "JayaJanardhana",
    ssr: "SRR",
    millets: "MilletsPro",
    default: "",
};

const CategoryPage = () => {
    const { brand } = useParams<{ brand: string }>();
    const navigate = useNavigate();
    const { setActiveBrand, theme } = useBrandTheme();

    const brandKey = slugToKey[brand || ""] || "default";

    useEffect(() => {
        if (brandKey !== "default") setActiveBrand(brandKey as BrandKey);
    }, [brandKey]);

    const category = keyToCategory[brandKey as BrandKey];

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", category],
        queryFn: async () => {
            const { data } = await api.get("/products", {
                params: category ? { category } : {},
            });
            return data.products || [];
        },
        enabled: !!category,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Themed top banner */}
            <div
                className="py-6 px-4"
                style={{ background: theme.gradient }}
            >
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white">{theme.name}</h1>
                        <p className="text-white/75 text-sm">{theme.description}</p>
                    </div>
                </div>
            </div>

            {/* Product grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primary }} />
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500">
                        Failed to load products. Please ensure your backend is running.
                    </div>
                ) : !data?.length ? (
                    <div className="text-center py-16 text-gray-400">
                        No products found for this brand yet. Seed the database to see products.
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-5">{data.length} products found</p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {data.map((product: any, i: number) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>

            <ShopFooter />
        </div>
    );
};

export default CategoryPage;
