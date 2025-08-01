import React from 'react';
import { ExternalLink, Award, Truck, Shield } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      // এখানে blue-600 পরিবর্তন করে primary-600 করা হয়েছে
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Quality Assured',
      description: 'All our tools are sourced from trusted manufacturers'
    },
    {
      // এখানে blue-600 পরিবর্তন করে primary-600 করা হয়েছে
      icon: <Truck className="w-8 h-8 text-primary-600" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery across Bangladesh'
    },
    {
      // এখানে blue-600 পরিবর্তন করে primary-600 করা হয়েছে
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: 'Warranty',
      description: 'Comprehensive warranty on all products'
    }
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              About ZontropaTi
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              ZontropaTi, powered by Zantrik, is your trusted source for high-quality car tools 
              in Bangladesh. We deliver reliable products with seamless service, ensuring every 
              car enthusiast and professional mechanic has access to the best automotive tools.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our commitment to excellence means we carefully select each product to meet the 
              highest standards of quality and durability. Whether you're a DIY enthusiast or 
              a professional mechanic, we have the right tools for your needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            <a
              href="https://zantrik.com"
              target="_blank"
              rel="noopener noreferrer"
              // এখানে blue-600 এবং blue-700 পরিবর্তন করা হয়েছে
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Learn More About Zantrik
              <ExternalLink size={18} />
            </a>
          </div>

          <div className="relative">
            <img
              src="https://img.freepik.com/free-photo/toolbox-with-tools_23-2151979291.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Professional car tools and equipment"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
              loading="lazy"
            />
            {/* এখানে blue-600 পরিবর্তন করে primary-600 করা হয়েছে */}
            <div className="absolute inset-0 bg-primary-600 bg-opacity-10 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;