import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ Generate or get customer ID for anonymous users
export const getCustomerId = (): string => {
  let customerId = localStorage.getItem('customer_id')
  if (!customerId) {
    customerId =
      'customer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('customer_id', customerId)
  }
  return customerId
}

// ✅ Create Supabase client with customer-id header
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'customer-id': getCustomerId(),
      
    },
  },
  
})
console.log('📡 Supabase client initialized with customer ID:', getCustomerId());

// ✅ Types
export type MenuItem = {
  id: string
  name: string
  price: number
  image: string
  category: string
  is_veg: boolean
  created_at: string
}

export type Order = {
  id: string
  customer_id: string
  order_number: string
  items: CartItem[]
  total_amount: number
  status: 'preparing' | 'ready' | 'delivered' | 'completed'
  payment_method: 'upi' | 'card' | 'cash'
  transaction_id: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  is_veg: boolean
}
