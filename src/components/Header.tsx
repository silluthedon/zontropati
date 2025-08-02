import React, { useState } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';

interface HeaderProps {
  onNavigate: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Products', id: 'products' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              ZontropaTi <span className="text-gray-600 text-sm">powered by Zantrik</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-gray-700 hover:text-primary-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('order')} // 'products' থেকে 'order' এ পরিবর্তন করা হয়েছে
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              View Cart {/* "Shop Now" থেকে "View Cart" এ পরিবর্তন করা হয়েছে */}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('order')} // 'products' থেকে 'order' এ পরিবর্তন করা হয়েছে
              className="w-full mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              View Cart
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
