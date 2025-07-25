import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, Truck } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';

const OrderStatus: React.FC = () => {
  const { orders, markOrderReceived } = useOrders();

  // Don't render anything if no orders
  if (orders.length === 0) {
    return null;
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'delivered':
        return <Truck className="w-5 h-5 text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'ready':
        return 'border-green-400 bg-green-400/10';
      case 'delivered':
        return 'border-blue-400 bg-blue-400/10';
      default:
        return 'border-yellow-400 bg-yellow-400/10';
    }
  };

  return (
    <motion.section
      id="order-status"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-8 px-4 bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-md"
    >
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 text-center">
          Your Orders
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border-2 ${getStatusColor(order.status)} backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-yellow-400">
                    {order.order_number}
                  </span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm text-gray-300 capitalize">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-1">Items:</p>
                  <div className="space-y-1">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <p key={index} className="text-sm text-gray-300">
                          {item.quantity}x {item.name}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No items available</p>
                    )}
                  </div>
                </div>


                <div className="flex items-center justify-between">
                  <span className="font-bold text-yellow-400">
                    ₹{order.total_amount}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded capitalize">
                      {order.payment_method}
                    </span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                      ID: {order.transaction_id}
                    </span>
                    {order.status === 'ready' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markOrderReceived(order.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-colors"
                      >
                        Received
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
};

export default OrderStatus;
