import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../App'; // App.tsx থেকে supabase ক্লায়েন্ট ইম্পোর্ট করা

const Auth = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    let error;
    if (isLoginView) {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      error = loginError;
    } else {
      const { error: signupError } = await supabase.auth.signUp({ email, password });
      error = signupError;
    }
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(isLoginView ? 'Login successful!' : 'Sign up successful! Please check your email to confirm.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto my-10">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        {isLoginView ? 'লগইন করুন' : 'সাইন আপ করুন'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ইমেইল</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            placeholder="********"
          />
        </div>
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'প্রসেসিং...' : (isLoginView ? 'লগইন' : 'সাইন আপ')}
        </button>
      </div>
      <p className="mt-4 text-sm text-center">
        {isLoginView ? 'আপনার কি অ্যাকাউন্ট নেই?' : 'আপনার কি একটি অ্যাকাউন্ট আছে?'}
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="text-primary-600 hover:text-primary-800 font-medium ml-1"
        >
          {isLoginView ? 'সাইন আপ করুন' : 'লগইন করুন'}
        </button>
      </p>
    </div>
  );
};

export default Auth;
