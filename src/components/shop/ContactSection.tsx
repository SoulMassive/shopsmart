import { motion } from "framer-motion";
import { Globe, Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

const ContactSection = () => {
    return (
        <footer className="bg-gray-900 pt-24 pb-12 px-4 md:px-8 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[100px]" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-black"
                            >
                                Let's get in <span className="text-green-500">touch</span>.
                            </motion.h2>
                            <p className="text-gray-400 text-lg max-w-md">
                                Have questions about how ShopSmart can help your business grow? Our team is here to support you.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -5, backgroundColor: "#22c55e" }}
                                    className="h-12 w-12 rounded-xl bg-gray-800 flex items-center justify-center transition-colors border border-white/5"
                                >
                                    <Icon size={20} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h4 className="text-xl font-bold border-b border-white/10 pb-4">Contact Details</h4>
                            <div className="space-y-5">
                                <a href="https://www.shopsmartblr.com" className="flex items-center gap-4 text-gray-400 hover:text-green-500 transition-colors group">
                                    <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                                        <Globe size={18} />
                                    </div>
                                    <span className="font-medium">www.shopsmartblr.com</span>
                                </a>
                                <a href="mailto:info@shopsmartblr.com" className="flex items-center gap-4 text-gray-400 hover:text-green-500 transition-colors group">
                                    <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <span className="font-medium">info@shopsmartblr.com</span>
                                </a>
                                <a href="tel:+917019850508" className="flex items-center gap-4 text-gray-400 hover:text-green-500 transition-colors group">
                                    <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <span className="font-medium">+91 70198 50508</span>
                                </a>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <h4 className="text-xl font-bold border-b border-white/10 pb-4">Our Location</h4>
                            <div className="flex items-start gap-4 text-gray-400 group">
                                <div className="h-10 w-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-all">
                                    <MapPin size={18} />
                                </div>
                                <address className="not-italic leading-relaxed font-medium">
                                    48, Church St, Haridevpur,<br/>
                                    Shanthala Nagar, Ashok Nagar,<br/>
                                    Bengaluru, Karnataka 560001
                                </address>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500 font-medium">
                    <p>© {new Date().getFullYear()} ShopSmart. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ContactSection;
