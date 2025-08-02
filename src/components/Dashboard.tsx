import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../App'; // App.tsx থেকে supabase ক্লায়েন্ট ইম্পোর্ট করা

// --- ডেটা ইন্টারফেস ---
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  quantity: number;
  status: string;
  order_date: string;
  product_id: string;
  product: Product;
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    const user = supabase.auth.getUser();
    if (!user) {
      toast.error('You need to be logged in to view orders.');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // RLS পলিসি অনুযায়ী, শুধুমাত্র বর্তমান লগইন করা ব্যবহারকারীর অর্ডার লোড হবে
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url
          )
        `);

      if (error) throw error;
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      toast.error('Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-10">অর্ডার লোড হচ্ছে...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">আমার অর্ডার</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">আপনার কোনো অর্ডার নেই।</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <img src={order.product.image_url} alt={order.product.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{order.product.name}</h3>
                <p className="text-gray-600">পরিমাণ: {order.quantity}</p>
                <p className="text-gray-600">স্ট্যাটাস: <span className="font-semibold text-primary-600">{order.status}</span></p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-sm">অর্ডার আইডি: {order.id.slice(0, 8)}...</p>
                <p className="font-bold text-xl text-primary-600">৳{(order.product.price * order.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
