import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section 
      id="hero" 
      className="relative text-white py-24 md:py-32"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          গাড়ির টুল এবং এক্সেসরিজ কিনুন, এক যায়গায় <span className="text-primary-300"></span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-2xl mx-auto">
          Powered by Zantrik – Your Automotive Solution
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
        >
          প্রোডাক্ট দেখুন
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default Hero;