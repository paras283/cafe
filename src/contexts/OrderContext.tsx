import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order, supabase, getCustomerId } from '../lib/supabase';
import toast from 'react-hot-toast';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: any[], totalAmount: number, paymentMethod: 'upi' | 'card' | 'cash') => Promise<string | null>;
  markOrderReceived: (orderId: string) => Promise<void>;
  refreshOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const generateOrderNumber = () => {
    return 'ORD' + Date.now().toString().slice(-6);
  };

  const fetchOrdersFromDB = async () => {
    try {
      const customerId = await getCustomerId(); // ✅ Await to get actual value

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch orders:', error.message);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
    }
  };

  useEffect(() => {
  let channel: ReturnType<typeof supabase.channel> | null = null;

  const setupRealtimeBroadcast = async () => {
    console.log('🔄 Setting up customer broadcast...');
    
    await fetchOrdersFromDB();

    const customerId = await getCustomerId();
    if (!customerId) {
      console.warn('⚠️ No customer ID found, skipping broadcast subscription.');
      return;
    }

    channel = supabase.channel('orders-broadcast');

    await channel.subscribe((status) => {
      console.log('📡 Customer channel status:', status);
      if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) {
        console.warn('⚠️ Customer channel dropped, re-subscribing...');
        setupRealtimeBroadcast(); // Reconnect
      }
    });

    console.log('✅ Customer subscribed to broadcast');

    channel.on('broadcast', { event: 'order_update' }, (payload) => {
      const {
        order: updatedOrder,
        customer_id: payloadCustomerId,
      } = payload.payload as {
        order: Order;
        customer_id: string;
      };

      if (payloadCustomerId !== customerId) return;

      console.log('📨 Received broadcast update:', updatedOrder);

      if (!updatedOrder || !updatedOrder.customer_id || !updatedOrder.items?.length) {
        console.warn('⚠️ Received malformed or empty order update:', updatedOrder);
        return;
      }

      setOrders((prev) => {
        const others = prev.filter((o) => o.id !== updatedOrder.id);
        return updatedOrder.status !== 'completed'
          ? [updatedOrder, ...others]
          : others;
      });

      if (updatedOrder.status === 'ready') {
        toast.success(`Order ${updatedOrder.order_number} is ready!`);
      }
    });
  };

  setupRealtimeBroadcast();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
      console.log('📴 Customer channel removed');
    }
  };
}, []);



  const createOrder = async (
    items: any[],
    totalAmount: number,
    paymentMethod: 'upi' | 'card' | 'cash'
  ): Promise<string | null> => {
    try {
      const orderNumber = generateOrderNumber();
      const customerId = await getCustomerId(); // ✅ Fix: await added
      const transactionId = '756488735546473'; // Replace with real txn ID if needed

      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          items,
          total_amount: totalAmount,
          status: 'preparing',
          payment_method: paymentMethod,
          transaction_id: transactionId,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(`Order ${orderNumber} placed successfully!`);
      fetchOrdersFromDB();

      return data.id;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order');
      return null;
    }
  };

  const markOrderReceived = async (orderId: string): Promise<void> => {
    try {
      const customerId = await getCustomerId(); // ✅ Fix: await added
      const { error } = await supabase
        .from('orders')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('customer_id', customerId);

      if (error) throw error;

      toast.success('Order marked as received!');
      fetchOrdersFromDB();
    } catch (error) {
      console.error('Error marking order as received:', error);
      toast.error('Failed to update order status');
    }
  };

  const refreshOrders = async () => {
    fetchOrdersFromDB();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        markOrderReceived,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
