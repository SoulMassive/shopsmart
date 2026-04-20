import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBrandTheme } from "@/context/BrandThemeContext";

const HeroBanner = () => {
    const { theme } = useBrandTheme();
    const navigate = useNavigate();

    return (
        <section
            className="w-full py-24 md:py-32 px-4 md:px-8 relative overflow-hidden"
            style={{ background: theme.gradient }}
        >
            {/* Animated particles/blobs for rich aesthetics */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black opacity-10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-white max-w-2xl"
                >
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-8 border border-white/20">
                        <Zap className="h-4 w-4 text-yellow-300" />
                        <span className="text-sm font-bold tracking-widest uppercase">Empowering Local Shops</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-8 tracking-tight">
                        Stock Your Store with<br />
                        <span className="text-green-200">Quality Products</span>
                    </h1>
                    
                    <div className="space-y-6 mb-10">
                        <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed max-w-xl">
                            Order directly from trusted brands and distributors. Fast delivery, bulk pricing, and smart retail solutions.
                        </p>
                        <p className="text-green-100 text-lg md:text-xl font-medium italic border-l-4 border-white/30 pl-6 leading-relaxed">
                            ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ಸ್ಮಾರ್ಟ್ ಆಗಿಸಿ — ಗುಣಮಟ್ಟದ ಉತ್ಪನ್ನಗಳನ್ನು ನೇರವಾಗಿ ಬ್ರಾಂಡ್‍ಗಳಿಂದ ಖರೀದಿಸಿ.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/retail")}
                            className="flex items-center justify-center gap-3 bg-white text-green-700 font-black px-10 py-5 rounded-2xl text-xl transition-all shadow-xl"
                        >
                            Browse Products <ArrowRight className="h-6 w-6" />
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                            className="flex items-center justify-center gap-3 bg-transparent border-2 border-white/30 text-white font-bold px-10 py-5 rounded-2xl text-xl backdrop-blur-sm transition-all"
                        >
                            <ShoppingBag className="h-6 w-6" />
                            Learn More
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="hidden md:block relative w-full max-w-lg"
                >
                    <div className="relative z-10 bg-white/10 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/20 shadow-2xl">
                        <img
                            src="/logo-shopsmart.png"
                            alt="ShopsMart"
                            className="w-full h-auto object-contain brightness-0 invert opacity-95 drop-shadow-2xl"
                        />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 border-2 border-white/10 rounded-[4rem] -scale-110 animate-spin-slow pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroBanner;
