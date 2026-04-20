import { motion } from "framer-motion";
import { Eye, Target, CheckCircle2 } from "lucide-react";

const VisionMissionSection = () => {
    return (
        <section className="py-20 px-4 md:px-8 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Our Vision & <span className="text-green-600">Mission</span>
                    </h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Empowering the backbone of retail with purpose and technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    {/* Vision Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Eye size={120} />
                        </div>
                        
                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 border border-blue-100 shadow-sm">
                            <Eye size={32} />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Vision 
                            <span className="text-gray-400 font-medium text-lg">/ ದೃಷ್ಟಿ</span>
                        </h3>
                        
                        <div className="space-y-4">
                            <p className="text-gray-600 text-lg leading-relaxed">
                                To empower every local shop to grow smarter, sell better, and serve customers efficiently.
                            </p>
                            <p className="text-blue-700/80 font-medium leading-relaxed italic border-l-2 border-blue-200 pl-4">
                                ಪ್ರತಿಯೊಂದು ಅಂಗಡಿ ಬುದ್ಧಿವಂತವಾಗಿ ಬೆಳೆಯಲಿ ಮತ್ತು ಗ್ರಾಹಕರಿಗೆ ಉತ್ತಮ ಸೇವೆ ನೀಡಲಿ.
                            </p>
                        </div>
                    </motion.div>

                    {/* Mission Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-gray-100 relative group overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-green-600">
                            <Target size={120} />
                        </div>

                        <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-8 border border-green-100 shadow-sm">
                            <Target size={32} />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            Mission
                            <span className="text-gray-400 font-medium text-lg">/ ಮಿಷನ್</span>
                        </h3>

                        <ul className="space-y-6">
                            {[
                                { en: "Create a connected network of shopkeepers.", kn: "ಅಂಗಡಿಯಾರರ ಬಲವಾದ ನೆಟ್‍ವರ್ಕ್ ನಿರ್ಮಿಸುವುದು." },
                                { en: "Provide digital learning, workshops, and tools.", kn: "ಡಿಜಿಟಲ್ ತರಬೇತಿ ಮತ್ತು ಸಾಧನಗಳನ್ನು ನೀಡುವುದು." },
                                { en: "Build a platform for collaborations and growth.", kn: "ಸಹಭಾಗಿತ್ವ ಮತ್ತು ಬೆಳವಣಿಗೆಯ ವೇದಿಕೆ ರೂಪಿಸುವುದು." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="mt-1.5 flex-shrink-0">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-gray-700 font-medium">{item.en}</p>
                                        <p className="text-green-700/70 text-sm mt-1">{item.kn}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default VisionMissionSection;
