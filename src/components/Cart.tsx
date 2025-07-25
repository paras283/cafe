import React from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useOrders } from '../contexts/OrderContext'
import PaymentModal from './PaymentModal'
import toast from 'react-hot-toast'

interface CartProps {
  isOpen: boolean
  onClose: () => void
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()
  const { createOrder } = useOrders()
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (paymentMethod: 'upi' | 'card' | 'cash') => {
    const orderId = await createOrder(cart, getTotalPrice(), paymentMethod)
    
    if (orderId) {
      clearCart()
      onClose()
      toast.success('Payment successful! Your order is being prepared.')
      
      // Scroll to order status section after placing order
      setTimeout(() => {
        const orderSection = document.getElementById('order-status')
        if (orderSection) {
          orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-l border-yellow-400/20 z-[50] overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="p-6 border-b border-yellow-400/20">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                      <ShoppingBag className="w-6 h-6" />
                      Your Cart
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-2 hover:bg-yellow-400/10 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-yellow-400" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
                      <p className="text-yellow-200 text-lg">Your cart is empty</p>
                      <p className="text-yellow-400/70 text-sm">Add some delicious items to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-black/50 rounded-lg p-4 border border-yellow-400/20"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-yellow-400">{item.name}</h3>
                              <p className="text-yellow-200">₹{item.price}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </motion.button>
                              <span className="w-8 text-center text-yellow-400 font-semibold">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </motion.button>
                            </div>
                            <span className="font-bold text-yellow-400">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-yellow-400/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-yellow-400">Total:</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        ₹{getTotalPrice()}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-3 rounded-full font-semibold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300"
                    >
                      Proceed to Checkout
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        totalAmount={getTotalPrice()}
      />
    </>
  )
}

export default Cart