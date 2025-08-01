import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fiuffyyulkspqfieftue.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdWZmeXl1bGtzcHFmaWVmdHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTMwMDUsImV4cCI6MjA2OTYyOTAwNX0.-0iv65qXNT9jGvEhlCqNRbyOIBxvoaMaSQOeN0KqmPc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  product_id: string;
  quantity: number;
  status: string;
  order_date: string;
  product?: Product;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
}