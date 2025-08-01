import React, { useState, useEffect } from 'react';
import { LogOut, Package, ShoppingBag, Users, Settings } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';
import ContactManagement from './ContactManagement';
import toast from 'react-hot-toast';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalContacts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersResult, productsResult, contactsResult] = await Promise.all([
        supabase.from('orders').select('id, status', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('contacts').select('id', { count: 'exact' }),
      ]);

      const pendingOrders = ordersResult.data?.filter(order => order.status === 'Pending').length || 0;

      setStats({
        totalOrders: ordersResult.count || 0,
        pendingOrders,
        totalProducts: productsResult.count || 0,
        totalContacts: contactsResult.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    onLogout();
    toast.success('Logged out successfully');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Settings size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'contacts', label: 'Contacts', icon: <Users size={20} /> },
  ];

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, color: 'bg-blue-500', icon: <ShoppingBag size={24} /> },
    { title: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-500', icon: <ShoppingBag size={24} /> },
    { title: 'Total Products', value: stats.totalProducts, color: 'bg-green-500', icon: <Package size={24} /> },
    { title: 'Total Contacts', value: stats.totalContacts, color: 'bg-purple-500', icon: <Users size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">
              ZontropaTi Admin Panel
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`${card.color} p-3 rounded-full text-white`}>
                      {card.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && <OrderManagement onStatsUpdate={fetchStats} />}
        {activeTab === 'products' && <ProductManagement onStatsUpdate={fetchStats} />}
        {activeTab === 'contacts' && <ContactManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;