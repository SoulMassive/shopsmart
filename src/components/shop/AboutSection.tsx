import React from 'react';
import { ShieldCheck, Heart, Leaf } from 'lucide-react';

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
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            About ShopSmart
          </h2>
          <p className="text-lg text-gray-600">
            ShopSmart is your trusted B2B partner for authentic pooja items, premium millets, and high-quality daily groceries. We bridge the gap between quality manufacturers and retail outlets.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 text-center mt-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white shadow-sm mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
