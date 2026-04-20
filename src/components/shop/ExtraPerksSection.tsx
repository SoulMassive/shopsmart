import { motion } from "framer-motion";
import { Star, Gift, MapPin } from "lucide-react";

const ExtraPerksSection = () => {
  const perks = [
    {
      title: "Event Opportunities",
      desc: "Higher footfall and visibility through exclusive events.",
      knTitle: "ಈವೆಂಟ್ ಅವಕಾಶಗಳು",
      knDesc: "ಹೆಚ್ಚು ಗ್ರಾಹಕರ ಭೇಟಿ ಮತ್ತು ಪ್ರದರ್ಶನ ಅವಕಾಶಗಳು.",
      icon: MapPin,
      color: "text-amber-500"
    },
    {
      title: "Gift Hampers & Rewards",
      desc: "Monthly rewards and recognition for performing shops.",
      knTitle: "ಉಡುಗೊರೆ ಹ್ಯಾಂಪರ್‍ಗಳು ಮತ್ತು ಬಹುಮಾನಗಳು",
      knDesc: "ಉತ್ತಮ ಕಾರ್ಯನಿರ್ವಹಣೆಗೆ ಮಾಸಿಕ ಉಡುಗೊರೆಗಳು.",
      icon: Gift,
      color: "text-rose-500"
    },
    {
      title: "Pure Value Benefits",
      desc: "Exclusive discounts for personal and shop use only.",
      knTitle: "ಪ್ಯೂರ್ ವ್ಯಾಲ್ಯೂ ಲಾಭಗಳು",
      knDesc: "ವೈಯಕ್ತಿಕ ಬಳಕೆಗಾಗಿ ವಿಶೇಷ ರಿಯಾಯಿತಿಗಳು.",
      icon: Star,
      color: "text-indigo-500"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {perks.map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center space-y-4 group"
            >
              <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                <perk.icon className={`h-8 w-8 ${perk.color}`} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-gray-900">{perk.title}</h4>
                <p className="text-sm font-medium text-gray-400">{perk.knTitle}</p>
              </div>
              <p className="text-gray-500 text-sm max-w-[250px]">
                {perk.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraPerksSection;
