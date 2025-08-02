import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { supabase, Product } from '../lib/supabase'; // এখানে import করা হচ্ছে

interface CartItem extends Product {
  quantity: number;
}

const schema = yup.object().shape({
  customerName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .matches(/^\+880\d{10}$/, 'Phone must be in +880XXXXXXXXXX format')
    .required('Phone number is required'),
  address: yup.string().required('Delivery address is required'),
});

interface OrderFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
}

interface OrderFormProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const OrderForm: React.FC<OrderFormProps> = ({ cart, setCart }) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: '+880',
    },
  });

  const onRemoveFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.success('Product removed from cart!');
  };

  const onSubmit = async (data: OrderFormData) => {
    if (cart.length === 0) {
      toast.error('Your cart is empty. Please add products to order.');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        customer_name: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        product_id: item.id,
        quantity: item.quantity,
      }));

      const { error } = await supabase
        .from('orders')
        .insert(orderItems);

      if (error) throw error;

      toast.success('Order placed successfully!');
      reset();
      setCart([]);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <section id="order" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              অর্ডার করুন
            </h2>
            <p className="text-lg text-gray-600">
              নিচের ফর্ম এ আপনার তথ্য দিন
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    পুরো নাম *
                  </label>
                  <input
                    type="text"
                    {...register('customerName')}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none ${
                      errors.customerName 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ইমেইল *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none ${
                      errors.email
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  মোবাইল নাম্বার *
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none ${
                    errors.phone
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="+8801234567890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none resize-none ${
                    errors.address
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="Enter your complete delivery address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">আমার কার্ট ({cart.length})</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center">কার্টে কোন পণ্য নেই</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-primary-600">৳{(item.price * item.quantity).toLocaleString()}</span>
                          <button onClick={() => onRemoveFromCart(item.id)} type="button" className="text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-2xl font-bold py-4 border-t border-gray-200">
                <span>মোট:</span>
                <span className="text-primary-600">৳{totalCartPrice.toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={submitting || cart.length === 0}
                className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderForm;
