import { motion } from "framer-motion";
import { HelpCircle, AlertTriangle, ShieldCheck } from "lucide-react";

const WhyShopSmartSection = () => {
    return (
        <section className="py-24 px-4 md:px-8 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-16 items-center">
                    <div className="flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold uppercase tracking-wider"
                        >
                            <HelpCircle className="h-4 w-4" />
                            <span>Why ShopSmart?</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1]"
                        >
                            Solving real challenges for <span className="text-orange-600 underline decoration-orange-200 underline-offset-8">local retailers</span>.
                        </motion.h2>

                        <div className="space-y-4">
                            <p className="text-xl text-gray-500 font-medium">
                                ಶಾಪ್ ಸ್ಮಾರ್ಟ್ ಯಾಕೆ?
                            </p>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Traditional shops face digital barriers. We bridge that gap with exposure and tools designed for the next generation of retail.
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 gap-6 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-red-50 border border-red-100 flex items-start gap-6 group hover:bg-red-100/50 transition-colors"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={28} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-gray-900">Digital Tool Gap</h4>
                                <p className="text-gray-600">Most small retailers lack access to digital tools.</p>
                                <p className="text-red-700/60 font-medium text-sm">ಸಣ್ಣ ಅಂಗಡಿಗಳಿಗೆ ಡಿಜಿಟಲ್ ಸಾಧನಗಳ ಅರಿವು ಕಡಿಮೆ.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-3xl bg-amber-50 border border-amber-100 flex items-start gap-6 group hover:bg-amber-100/50 transition-colors"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <HelpCircle size={28} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-gray-900">Limited Awareness</h4>
                                <p className="text-gray-600">Limited awareness about brand collaborations.</p>
                                <p className="text-amber-700/60 font-medium text-sm">ಬ್ರಾಂಡ್‍ಗಳ ಸಹಕಾರದ ಅವಕಾಶಗಳು ಸಿಗುತ್ತಿಲ್ಲ.</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-3xl bg-green-50 border border-green-100 flex items-start gap-6 group hover:bg-green-100/50 transition-colors"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                                <ShieldCheck size={28} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-bold text-gray-900">Modern Visibility</h4>
                                <p className="text-gray-600">ShopSmart provides a single platform for visibility, growth, and modernization.</p>
                                <p className="text-green-700/60 font-medium text-sm">ಶಾಪ್ ಸ್ಮಾರ್ಟ್ ಈ ಎಲ್ಲವನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಒದಗಿಸುತ್ತದೆ.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyShopSmartSection;
