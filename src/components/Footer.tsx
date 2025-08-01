import React from 'react';
import { Facebook, Twitter, Instagram, Crown } from 'lucide-react'; // Crown আইকন ইম্পোর্ট করা হয়েছে

interface FooterProps {
  onNavigate: (section: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Products', id: 'products' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              ZontropaTi <span className="text-primary-400">powered by Zantrik</span> {/* এখানে blue-400 পরিবর্তন করা হয়েছে */}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your trusted source for high-quality car tools in Bangladesh. 
              Professional automotive equipment for every need.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-200" // এখানে blue-400 পরিবর্তন করা হয়েছে
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  // এখানে hover:bg-blue-600 পরিবর্তন করা হয়েছে
                  className="bg-gray-800 p-3 rounded-full hover:bg-primary-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 ZontropaTi. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-1"> {/* flex, items-center, justify-center, gap-1 যোগ করা হয়েছে */}
            <Crown size={16} className="text-primary-400" /> {/* মুকুট আইকন যোগ করা হয়েছে */}
            Created by <span className="text-primary-400 font-semibold">Softqueen</span> {/* এখানে blue-400 পরিবর্তন করা হয়েছে */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;