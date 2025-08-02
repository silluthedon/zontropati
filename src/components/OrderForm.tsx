import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // আপনার Supabase ক্লায়েন্টের ফাইল
import toast from 'react-hot-toast';

// এই ইন্টারফেসগুলো আপনার ডেটাবেস স্কিমা অনুযায়ী হতে হবে
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

// এই কম্পোনেন্টটি একটি একক প্রোডাক্টের জন্য অর্ডারিং লজিক দেখাবে
const ProductOrdering: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // উদাহরণস্বরূপ একটি প্রোডাক্ট ডেটা
  const exampleProduct: Product = {
    id: 'f4f1a60c-2d3b-4c8d-8c1a-2b7e1c4e7d5c',
    name: 'Wrench Kit',
    description: 'Adjustable wrench set for various automotive applications',
    price: 1200,
    image_url: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg'
  };

  // কম্পোনেন্ট লোড হওয়ার সাথে সাথে ব্যবহারকারীর লগইন স্ট্যাটাস চেক করা হবে
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) {
        setShowLoginForm(false); // লগইন হয়ে গেলে ফর্ম লুকিয়ে রাখা
      }
    });

    // প্রাথমিক স্ট্যাটাস সেট করার জন্য একবার বর্তমান ব্যবহারকারীর তথ্য নেওয়া
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // যদি ব্যবহারকারী লগইন করা থাকে, তাহলে অর্ডার প্লেস করার ফাংশন
  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('You must be logged in to place an order.');
      return;
    }
    
    // এখানে আপনার অর্ডার প্লেস করার আসল লজিক থাকবে।
    // যেমন: একটি অর্ডার ডেটাবেসে insert করা
    console.log(`User ${user.email} is placing an order for product ${exampleProduct.name}`);
    toast.success('Product added to your cart successfully!');
    
    // এখানে অর্ডার ডেটাবেসে যোগ করার জন্য Supabase কল করতে পারেন।
    // যেমন:
    /*
    const { data, error } = await supabase.from('orders').insert([{
      customer_name: 'Example User', // বা user.user_metadata থেকে নাম
      email: user.email,
      phone: '1234567890',
      address: 'Example Address',
      product_id: exampleProduct.id,
      quantity: 1,
      user_id: user.id,
    }]);

    if (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order.');
    } else {
      toast.success('Order placed successfully!');
    }
    */
  };

  // যদি ব্যবহারকারী লগইন করা না থাকে, তাহলে লগইন ফর্ম দেখানোর ফাংশন
  const handleLoginAttempt = () => {
    // যদি লগইন করা না থাকে, তাহলে ফর্ম দেখানো
    if (!user) {
      setShowLoginForm(true);
    }
  };

  // লগইন ফর্ম সাবমিট করার ফাংশন
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg space-y-4 m-4">
      {/* প্রোডাক্ট কার্ড */}
      <img className="h-48 w-full object-cover rounded-lg" src={exampleProduct.image_url} alt={exampleProduct.name} />
      <div className="text-center">
        <div className="text-xl font-medium text-black">{exampleProduct.name}</div>
        <p className="text-gray-500">Price: ৳{exampleProduct.price}</p>
      </div>

      {/* শর্তযুক্ত বোতাম */}
      <div className="mt-4">
        {user ? (
          <button
            onClick={handlePlaceOrder}
            className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add to Cart
          </button>
        ) : (
          <button
            onClick={handleLoginAttempt}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Log in to Order
          </button>
        )}
      </div>

      {/* শর্তযুক্ত লগইন ফর্ম */}
      {showLoginForm && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-bold mb-3 text-center">Log In to continue</h3>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Log In
            </button>
          </form>
          <button
            onClick={() => setShowLoginForm(false)}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700 w-full text-center"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductOrdering;
