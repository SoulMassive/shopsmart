import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBrandTheme, brandThemes, BrandKey } from "@/context/BrandThemeContext";

const categoryMeta: { key: BrandKey; slug: string; emoji: string }[] = [
    { key: "jaya", slug: "jaya-janardhana", emoji: "🌾" },
    { key: "ssr", slug: "ssr", emoji: "🌾" },
    { key: "millets", slug: "millets-pro", emoji: "🌿" },
];

const CategorySection = () => {
    const { setActiveBrand } = useBrandTheme();
    const navigate = useNavigate();

    const handleClick = (item: typeof categoryMeta[0]) => {
        setActiveBrand(item.key);
        navigate(`/category/${item.slug}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shop by Brand</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {categoryMeta.map((item, i) => {
                    const theme = brandThemes[item.key];
                    return (
                        <motion.div
                            key={item.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
                            onClick={() => handleClick(item)}
                            className="cursor-pointer rounded-2xl overflow-hidden border border-gray-100"
                            style={{ background: theme.secondary, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
                        >
                            {/* Coloured top bar */}
                            <div className="h-2 w-full" style={{ background: theme.gradient }} />

                            <div className="p-6 flex flex-col gap-4">
                                {/* Emoji + Name */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-14 w-14 rounded-xl flex items-center justify-center text-3xl"
                                        style={{ background: theme.bgLight }}
                                    >
                                        {item.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg" style={{ color: theme.accent }}>
                                            {theme.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 leading-tight mt-0.5">{theme.description}</p>
                                    </div>
                                </div>

                                {/* CTA */}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                                    style={{ background: theme.gradient }}
                                >
                                    Browse Products <ArrowRight className="h-4 w-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default CategorySection;
