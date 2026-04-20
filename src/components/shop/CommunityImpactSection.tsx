import { motion } from "framer-motion";
import { Users, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityImpactSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 md:px-8 bg-green-600 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <Users className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Community Impact</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Building a connected <br/>
              <span className="text-green-200">retail ecosystem</span>.
            </h2>
            
            <div className="space-y-6">
              <p className="text-xl text-green-50 leading-relaxed font-medium">
                Through ShopSmart, local shops can connect with each other, learn from workshops, participate in brand campaigns, and grow their customer base.
              </p>
              
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/10 italic">
                <p className="text-green-50 text-lg leading-relaxed">
                  ಶಾಪ್ ಸ್ಮಾರ್ಟ್ ಮೂಲಕ ಅಂಗಡಿಗಳು ಪರಸ್ಪರ ಸಂಪರ್ಕ ಸಾಧಿಸಿ, ತರಬೇತಿಯಲ್ಲಿ ಭಾಗವಹಿಸಿ, ಹೊಸ ಗ್ರಾಹಕರನ್ನು ಪಡೆಯಬಹುದು.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full"
          >
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl space-y-8">
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-gray-900">
                  Join Us | <span className="text-green-600 italic">ನಮ್ಮನ್ನು ಸೇರಿ</span>
                </h3>
                <p className="text-gray-500 text-lg">
                  Be Part of ShopSmart. Let’s build a community where every shop is connected, digital, and profitable.
                </p>
                <p className="text-green-700/60 font-medium italic">
                  ನಮ್ಮ ಶಾಪ್ ಸ್ಮಾರ್ಟ್ ಸಮುದಾಯದ ಭಾಗವಾಗಿರಿ — ನಿಮ್ಮ ಅಂಗಡಿಯನ್ನು ಡಿಜಿಟಲ್ ಮತ್ತು ಲಾಭದಾಯಕವಾಗಿ ಪರಿವರ್ತಿಸಿ!
                </p>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 text-xl shadow-xl shadow-green-200 transition-all"
                >
                  <Rocket className="h-6 w-6" />
                  Start Your Journey
                </motion.button>
                <p className="text-center text-gray-400 mt-6 text-sm font-medium">
                  Join our mission and start your smart retail journey today!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunityImpactSection;
