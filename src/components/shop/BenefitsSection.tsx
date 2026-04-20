import { motion } from "framer-motion";
import { 
  TrendingUp, Gift, Package, GraduationCap, 
  Sparkles, Percent, CreditCard, Tag, UserPlus 
} from "lucide-react";

const benefits = [
    {
        title: "B2B Reselling",
        subtitle: "33.3% Margin",
        desc: "Shops can buy products from ShopSmart and resell them independently.",
        knTitle: "B2B ಮರು ಮಾರಾಟ ಅವಕಾಶ",
        knDesc: "ಅಂಗಡಿಗಳು ShopSmart ನಿಂದ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆದು ಸ್ವತಂತ್ರವಾಗಿ ಮಾರಾಟ ಮಾಡಬಹುದು.",
        icon: TrendingUp,
        color: "bg-blue-500"
    },
    {
        title: "Free Complementary",
        subtitle: "Product Support",
        desc: "Shops receive free complementary products along with purchases.",
        knTitle: "ಉಚಿತ ಪೂರಕ ಉತ್ಪನ್ನಗಳ ಬೆಂಬಲ",
        knDesc: "ಉತ್ಪನ್ನಗಳೊಂದಿಗೆ ಅಂಗಡಿಗಳಿಗೆ ಉಚಿತ ಪೂರಕ ಉತ್ಪನ್ನಗಳನ್ನು ನೀಡಲಾಗುತ್ತದೆ.",
        icon: Gift,
        color: "bg-purple-500"
    },
    {
        title: "First Consignment",
        subtitle: "Special Offers",
        desc: "New market-entry products are given at very low bulk prices.",
        knTitle: "ಮೊದಲ ಕಾನ್ಸೈನ್ಮೆಂಟ್ ವಿಶೇಷ ಆಫರ್‍ಗಳು",
        knDesc: "ಹೊಸ ಮಾರುಕಟ್ಟೆ ಪ್ರವೇಶದ ಉತ್ಪನ್ನಗಳನ್ನು ಕಡಿಮೆ ದರದಲ್ಲಿ ಒದಗಿಸಲಾಗುತ್ತದೆ.",
        icon: Package,
        color: "bg-orange-500"
    },
    {
        title: "Digital Support",
        subtitle: "Training & Marketing",
        desc: "Shops receive training on sales improvement and shop management.",
        knTitle: "ತರಬೇತಿ ಮತ್ತು ಡಿಜಿಟಲ್ ಮಾರ್ಕೆಟಿಂಗ್ ಬೆಂಬಲ",
        knDesc: "ಮಾರಾಟ ಮತ್ತು ಅಂಗಡಿ ನಿರ್ವಹಣೆಗೆ ಸಂಬಂಧಿಸಿದ ತರಬೇತಿಯನ್ನು ನೀಡಲಾಗುತ್ತದೆ.",
        icon: GraduationCap,
        color: "bg-green-500"
    },
    {
        title: "Freebies",
        subtitle: "Boost Your Sales",
        desc: "Free products are provided to be used as add-ons during sales.",
        knTitle: "ಮಾರಾಟ ಹೆಚ್ಚಿಸಲು ಉಚಿತ ಫ್ರೀಬೀಸ್",
        knDesc: "ಮಾರಾಟದ ವೇಳೆ add-on ಆಗಿ ಬಳಸಲು ಉಚಿತ ಉತ್ಪನ್ನಗಳನ್ನು ನೀಡಲಾಗುತ್ತದೆ.",
        icon: Sparkles,
        color: "bg-pink-500"
    },
    {
        title: "50% + Products",
        subtitle: "High Discounts",
        desc: "Selected products are provided at highly discounted prices.",
        knTitle: "50% ಅಥವಾ ಹೆಚ್ಚಿನ ರಿಯಾಯಿತಿ ಉತ್ಪನ್ನಗಳು",
        knDesc: "ಆಯ್ದ ಉತ್ಪನ್ನಗಳನ್ನು ಹೆಚ್ಚಿನ ರಿಯಾಯಿತಿಯಲ್ಲಿ ಒದಗಿಸಲಾಗುತ್ತದೆ.",
        icon: Percent,
        color: "bg-red-500"
    },
    {
        title: "Credit Voucher",
        subtitle: "Facility",
        desc: "Trusted shops may receive products on credit after performance review.",
        knTitle: "ಕ್ರೆಡಿಟ್ ವೌಚರ್ ಸೌಲಭ್ಯ",
        knDesc: "ನಂಬಿಗಸ್ತ ಅಂಗಡಿಗಳಿಗೆ ಕಾರ್ಯಕ್ಷಮತೆಯ ಆಧಾರದ ಮೇಲೆ ಕ್ರೆಡಿಟ್‍ನಲ್ಲಿ ಉತ್ಪನ್ನ ನೀಡಲಾಗುತ್ತದೆ.",
        icon: CreditCard,
        color: "bg-indigo-500"
    },
    {
        title: "White Labeling",
        subtitle: "Your Shop Brand",
        desc: "Customized labels are provided for unlabeled products.",
        knTitle: "ವೈಟ್ ಲೇಬಲಿಂಗ್ (ನಿಮ್ಮ ಅಂಗಡಿ ಬ್ರಾಂಡ್)",
        knDesc: "ಲೇಬಲ್ ಇಲ್ಲದ ಉತ್ಪನ್ನಗಳಿಗೆ ಕಸ್ಟಮೈಸ್ ಮಾಡಿದ ಲೇಬಲ್‍ಗಳನ್ನು ನೀಡಲಾಗುತ್ತದೆ.",
        icon: Tag,
        color: "bg-cyan-500"
    },
    {
        title: "BP Perks",
        subtitle: "Staff Extra Income",
        desc: "Shop staff can work as Brand Promoters during free time.",
        knTitle: "BP ಪರ್ಕ್ಸ್ (ಸಿಬ್ಬಂದಿಗೆ ಹೆಚ್ಚುವರಿ ಆದಾಯ)",
        knDesc: "ಅಂಗಡಿ ಸಿಬ್ಬಂದಿ ಖಾಲಿ ಸಮಯದಲ್ಲಿ ಬ್ರಾಂಡ್ ಪ್ರಮೋಟರ್ ಆಗಿ ಕೆಲಸ ಮಾಡಬಹುದು.",
        icon: UserPlus,
        color: "bg-emerald-500"
    }
];

const BenefitsSection = () => {
    return (
        <section className="py-24 px-4 md:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900">
                      Our Benefits | <span className="text-green-600">ನಮ್ಮ ಪ್ರಯೋಜನಗಳು</span>
                    </h2>
                    <p className="text-gray-500 text-lg max-w-3xl mx-auto font-medium">
                        Powerful advantages designed to help your retail business thrive in the modern market.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center group"
                        >
                            <div className={`${benefit.color} h-20 w-20 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                                <benefit.icon size={36} />
                            </div>

                            <div className="space-y-4 flex-grow flex flex-col">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-sm font-bold text-green-600 uppercase tracking-widest mt-1">
                                        {benefit.subtitle}
                                    </p>
                                </div>

                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {benefit.desc}
                                </p>

                                <div className="pt-4 mt-auto border-t border-gray-50 space-y-2">
                                    <h4 className="text-lg font-bold text-gray-800">
                                        {benefit.knTitle}
                                    </h4>
                                    <p className="text-gray-400 text-xs italic leading-tight">
                                        {benefit.knDesc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
