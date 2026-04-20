import { motion } from "framer-motion";
import { Info, ShieldCheck, Heart, Leaf } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      title: 'Quality Promise',
      description: 'We ensure 100% authentic and premium quality products for your business.'
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: 'Our Mission',
      description: 'To empower local retailers with reliable supply chains and fresh produce.'
    },
    {
      icon: <Leaf className="w-6 h-6 text-teal-600" />,
      title: 'Local Sourcing',
      description: 'Supporting local farmers and manufacturers for sustainable growth.'
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium mb-6">
              <Info className="h-4 w-4" />
              <span>What is ShopSmart?</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              Helping shops grow <br/>
              <span className="text-green-600">Smarter & Stronger</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
              ShopSmart is a trusted B2B partner that helps local shops and small retailers modernize their business operations. We bridge the gap between quality manufacturers and retail outlets, providing authentic products and digital tools to make every shop future-ready.
            </p>

            <div className="p-8 border-l-4 border-green-500 bg-gray-50 rounded-r-3xl italic shadow-sm">
              <p className="text-xl text-gray-700 leading-relaxed font-semibold">
                ಶಾಪ್ ಸ್ಮಾರ್ಟ್ ಒಂದು ವೇದಿಕೆ — ಇದು ಸ್ಥಳೀಯ ಅಂಗಡಿಗಳನ್ನು ಆಧುನಿಕ ವ್ಯಾಪಾರ ಮತ್ತು ಡಿಜಿಟಲ್ ಸಾಧನಗಳ ಮೂಲಕ ಬೆಳೆಯಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಪ್ರತಿ ಅಂಗಡಿಯನ್ನು “ಸ್ಮಾರ್ಟ್” ಮತ್ತು ಭವಿಷ್ಯಕ್ಕೆ ಸಿದ್ಧಗೊಳಿಸುವುದು ಇದರ ಉದ್ದೇಶ.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern Retail" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70" />
          </motion.div>
        </div>

        {/* Feature Grid from Remote */}
        <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center p-10 bg-gray-50 rounded-[2.5rem] text-center border border-transparent hover:border-green-100 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-white shadow-md mb-6 text-green-600">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
