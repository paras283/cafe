import React, { createContext, useContext, useEffect, useState } from 'react';
import { Order, supabase, createCustomerClient, getCustomerId } from '../lib/supabase';
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
      const customerClient = createCustomerClient();
      const customerId = getCustomerId();

      const { data, error } = await customerClient
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrdersFromDB();

    const setupRealtimeSubscription = () => {
      const customerClient = createCustomerClient();
      const customerId = getCustomerId();

      const channel = customerClient
        .channel('orders-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            table: 'orders',
            filter: `customer_id=eq.${customerId}`
          },
          (payload) => {
            console.log('Real-time update received:', payload);
            const updatedOrder = payload.new as Order;

            if (updatedOrder && updatedOrder.customer_id === customerId) {
              setOrders(prev => {
                const others = prev.filter(o => o.id !== updatedOrder.id);

                if (updatedOrder.status !== 'completed') {
                  return [updatedOrder, ...others];
                } else {
                  return others;
                }
              });

              if (updatedOrder.status === 'ready') {
                          }
                      }
          }
        )
        .subscribe();

      return channel;
    };

    const channel = setupRealtimeSubscription();

    return () => {
      if (channel) {
        const customerClient = createCustomerClient();
        customerClient.removeChannel(channel);
      }
    };
  }, []);

  const createOrder = async (
    items: any[],
    totalAmount: number,
    paymentMethod: 'upi' | 'card' | 'cash'
  ): Promise<string | null> => {
    try {
      const customerClient = createCustomerClient();
      const orderNumber = generateOrderNumber();
      const customerId = getCustomerId();
      const transactionId = '756488735546473' // Sample transaction ID

      const { data, error } = await customerClient
        .from('orders')
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          items,
          total_amount: totalAmount,
          status: 'preparing',
          payment_method: paymentMethod,
          transaction_id: transactionId
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
      const customerId = getCustomerId();
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
        refreshOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
