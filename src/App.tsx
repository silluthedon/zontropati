import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import OrderForm from './components/OrderForm';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPage from './pages/AdminPage';
import { Product } from './lib/supabase';

// কার্টের আইটেমের জন্য নতুন ইন্টারফেস তৈরি
interface CartItem extends Product {
  quantity: number;
}

const LandingPage: React.FC = () => {
  // কার্ট স্টেট এবং সেট ফাংশন তৈরি
  const [cart, setCart] = useState<CartItem[]>([]);

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  return (
    <div className="font-roboto">
      <Header onNavigate={handleNavigation} />
      <Hero onNavigate={handleNavigation} />
      <Products onAddToCart={handleAddToCart} />
      {/* OrderForm-এ কার্ট স্টেট এবং সেট ফাংশন পাস করা হয়েছে */}
      <OrderForm cart={cart} setCart={setCart} />
      <About />
      <Contact />
      <Footer onNavigate={handleNavigation} />
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;