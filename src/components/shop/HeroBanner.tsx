import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBrandTheme } from "@/context/BrandThemeContext";

const HeroBanner = () => {
    const { theme } = useBrandTheme();
    const navigate = useNavigate();

    return (
        <section
            className="w-full py-10 px-4 md:px-8"
            style={{ background: theme.gradient }}
        >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white max-w-lg"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                        Stock Your Store with<br />Quality Products
                    </h1>
                    <p className="text-white/80 text-base mb-6">
                        Order directly from trusted brands and distributors. Fast delivery, bulk pricing.
                    </p>
                    <button
                        onClick={() => navigate("/retail")}
                        className="flex items-center gap-2 bg-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity"
                        style={{ color: theme.accent }}
                    >
                        Browse Products <ArrowRight className="h-4 w-4" />
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="hidden md:flex items-center justify-center rounded-2xl overflow-hidden"
                >
                    <img
                        src="/logo-shopsmart.png"
                        alt="ShopsMart"
                        className="h-32 w-auto object-contain opacity-90"
                        style={{ filter: "brightness(0) invert(1)" }}
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroBanner;
