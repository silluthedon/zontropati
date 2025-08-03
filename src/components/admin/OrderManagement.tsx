import React, { useState, useEffect } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// Assuming these interfaces are defined in '../../lib/supabase' or elsewhere
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
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
  product: Product;
  product_id: string;
  user_id: string;
}

interface OrderManagementProps {
  onStatsUpdate: () => void;
}

const categories = ['All', 'Tools', 'Accessories', 'Engine oil', 'Spare parts'];
const statuses = ['All', 'Pending', 'Shipped', 'Delivered']; // নতুন স্ট্যাটাস লিস্ট

const OrderManagement: React.FC<OrderManagementProps> = ({ onStatsUpdate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // existing filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('');
  
  // New filters for Id and Status
  const [orderIdSearchTerm, setOrderIdSearchTerm] = useState(''); // Added for ID search
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All'); // Added for status filter

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchProducts();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user, currentPage, searchTerm, productFilter, selectedCategoryFilter, orderIdSearchTerm, selectedStatusFilter]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('id, name, price, category');
      if (error) throw error;
      setProducts(data as Product[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load product list');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;

      let query = supabase
        .from('orders')
        .select(`
          id,
          customer_name,
          email,
          phone,
          address,
          quantity,
          status,
          order_date,
          product_id,
          products (
            id,
            name,
            price,
            category
          )
        `, { count: 'exact' })
        .eq('user_id', user.id);

      // Filtering logic
      const searchClauses = [];
      if (searchTerm) {
        searchClauses.push(`customer_name.ilike.%${searchTerm}%`);
        searchClauses.push(`email.ilike.%${searchTerm}%`);
      }
      if (orderIdSearchTerm) {
        // Partial search for Order ID
        searchClauses.push(`id.ilike.%${orderIdSearchTerm}%`);
      }
      
      if (searchClauses.length > 0) {
        query = query.or(searchClauses.join(','));
      }
      
      if (selectedCategoryFilter !== 'All') {
        query = query.eq('products.category', selectedCategoryFilter);
      }
      
      if (productFilter) {
        query = query.eq('product_id', productFilter);
      }
      
      // New status filter
      if (selectedStatusFilter !== 'All') {
        query = query.eq('status', selectedStatusFilter);
      }
      
      const { data, error, count } = await query
        .order('order_date', { ascending: false })
        .range(offset, offset + itemsPerPage - 1);

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      const formattedOrders = data.map((order: any) => ({
        ...order,
        product: order.products,
      }));

      setOrders(formattedOrders as Order[]);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));

    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (orderData: Omit<Order, 'id' | 'status' | 'order_date' | 'product' | 'user_id'>) => {
    if (!user) {
      toast.error('You must be logged in to place an order.');
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.from('orders').insert([{
        ...orderData,
        user_id: user.id,
      }]);

      if (error) throw error;
      
      toast.success('Order placed successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success('Order status updated successfully');
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOrderIdSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrderIdSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategoryFilter(category);
    setProductFilter(''); 
    setCurrentPage(1);
  };
  
  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
    setCurrentPage(1);
  };

  const handleProductFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductFilter(e.target.value);
    setSelectedCategoryFilter('All');
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <p>Please log in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">My Orders</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={orderIdSearchTerm}
            onChange={handleOrderIdSearch}
            className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={selectedStatusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={productFilter}
            onChange={handleProductFilterChange}
            className="w-full md:w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Products</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-gray-500">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product?.name || 'Unknown Product'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {order.product?.category || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                <div>
                  <strong>Customer Name:</strong> {selectedOrder.customer_name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedOrder.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedOrder.phone}
                </div>
                <div>
                  <strong>Address:</strong> {selectedOrder.address}
                </div>
                <div>
                  <strong>Product:</strong> {selectedOrder.product?.name}
                </div>
                <div>
                  <strong>Category:</strong> {selectedOrder.product?.category || 'N/A'}
                </div>
                <div>
                  <strong>Quantity:</strong> {selectedOrder.quantity}
                </div>
                <div>
                  <strong>Status:</strong>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <strong>Order Date:</strong> {new Date(selectedOrder.order_date).toLocaleString()}
                </div>
                <div>
                  <strong>Total Amount:</strong> ৳{((selectedOrder.product?.price || 0) * selectedOrder.quantity).toLocaleString()}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
