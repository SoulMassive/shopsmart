import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Package } from "lucide-react";
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
            let products = data.products || [];

            if (category === "MilletsPro") {
                const grouped: Record<string, any> = {};
                products.forEach((p: any) => {
                    // Extract base name, removing weight (e.g., "500g", "1kg")
                    const baseName = p.name.replace(/\s*(500g|1kg|250g|5kg)\s*/i, '').trim();
                    
                    if (!grouped[baseName]) {
                        grouped[baseName] = { 
                            ...p, 
                            name: baseName, // Use cleaned name
                            variants: []
                        };
                    }
                    
                    grouped[baseName].variants.push({
                        _id: p._id,
                        weight: p.weight,
                        weightInKg: p.weightInKg,
                        price: p.price,
                        originalPrice: p.originalPrice,
                        discountedPrice: p.discountedPrice,
                        discountPercentage: p.discountPercentage,
                        stock: p.stock,
                        label: p.weight >= 1000 ? `${p.weight/1000}kg` : `${p.weight}g`
                    });
                });
                
                // Sort variants by weight and set default display values
                Object.values(grouped).forEach((g: any) => {
                    if (g.variants && g.variants.length > 0) {
                        g.variants.sort((a: any, b: any) => (a.weight || 0) - (b.weight || 0));
                    }
                });
                
                products = Object.values(grouped);
            }

            return products;
        },
        enabled: !!category,
    });

    const featuredProducts = data?.slice(0, 4) || [];
    const allProducts = data || [];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            {/* Themed top banner */}
            <div
                className="py-10 px-4 relative overflow-hidden"
                style={{ background: theme.gradient }}
            >
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="max-w-2xl">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors mb-4 w-fit"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">{theme.name}</h1>
                        <p className="text-white/90 text-lg leading-relaxed mb-4">{theme.description}</p>
                        <div className="inline-block bg-white/20 px-4 py-2 rounded-lg text-white text-sm font-medium backdrop-blur-sm border border-white/10">
                            ✨ Special Offer: Get exclusive B2B rates directly from {theme.name} manufacturers.
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                         <button
                             onClick={() => navigate(`/bulk-order?category=${brand}`)}
                             className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                             style={{ color: theme.accent }}
                         >
                             <Package className="h-5 w-5" />
                             Bulk / Custom Order
                         </button>
                    </div>
                </div>
            </div>

            {/* Product Section */}
            <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primary }} />
                    </div>
                ) : error ? (
                    <div className="text-center py-16 text-red-500">
                        Failed to load products. Please ensure your backend is running.
                    </div>
                ) : !allProducts.length ? (
                    <div className="text-center py-16 text-gray-400">
                        No products found for this brand yet.
                    </div>
                ) : (
                    <>
                        {featuredProducts.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span style={{ color: theme.accent }}>★</span> Featured Products
                                </h2>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                                >
                                    {featuredProducts.map((product: any, i: number) => (
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
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
                                <p className="text-sm text-gray-500">{allProducts.length} items</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {allProducts.map((product: any, i: number) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ShopFooter />
        </div>
    );
};

export default CategoryPage;
