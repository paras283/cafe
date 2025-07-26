import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UtensilsCrossed, ShoppingCart, User, Menu as MenuIcon, X, BookOpen, Info, Phone, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { supabase } from '../lib/supabase'

interface NavbarProps {
  onCartClick: () => void
  onAdminClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onAdminClick }) => {
  const { getTotalItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [showOrders, setShowOrders] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const fetchPastOrders = async () => {
    setLoading(true)
    try {
      const customerId = localStorage.getItem('customer_id')
      if (!customerId) {
        console.warn('No customer ID found')
        return
      }
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
      setShowOrders(true)
    } catch (err) {
      console.error('Error fetching past orders:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-yellow-400/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-yellow-400">FoodCourt</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-yellow-200 hover:text-yellow-400 transition-colors">Menu</a>
            <a href="#about" className="text-yellow-200 hover:text-yellow-400 transition-colors">About</a>
            <a href="#contact" className="text-yellow-200 hover:text-yellow-400 transition-colors">Contact</a>
            <button
              onClick={fetchPastOrders}
              className="text-yellow-200 hover:text-yellow-400 transition-colors flex items-center gap-1"
            >
              <Clock size={18} /> Past Orders
            </button>
          </div>

          {/* Right Section: Cart + Admin + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative p-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </motion.button>

            {/* Admin Button for Desktop */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdminClick}
              className="hidden md:flex p-2 border border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-black transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>

            {/* Hamburger (Mobile Only) */}
            <button className="md:hidden p-2 text-yellow-400" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 bg-black/90 text-yellow-200 rounded-lg shadow-lg py-4 flex flex-col items-center gap-4 px-4"
            >
              {/* Menu Link */}
              <a
                href="#menu"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 rounded-full px-4 py-2 hover:bg-yellow-400 hover:text-black w-full justify-center"
              >
                <BookOpen size={18} /> Menu
              </a>

              {/* About Link */}
              <a
                href="#about"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 rounded-full px-4 py-2 hover:bg-yellow-400 hover:text-black w-full justify-center"
              >
                <Info size={18} /> About
              </a>

              {/* Contact Link */}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 rounded-full px-4 py-2 hover:bg-yellow-400 hover:text-black w-full justify-center"
              >
                <Phone size={18} /> Contact
              </a>

              {/* Past Orders Button */}
              <button
                onClick={() => {
                  fetchPastOrders()
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 rounded-full px-4 py-2 hover:bg-yellow-400 hover:text-black w-full justify-center"
              >
                <Clock size={18} /> Past Orders
              </button>

              {/* Admin Login Button */}
              <button
                onClick={() => {
                  onAdminClick()
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 border border-yellow-400 text-yellow-400 rounded-full px-4 py-2 hover:bg-yellow-400 hover:text-black w-full justify-center"
              >
                <User size={18} /> Admin Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Past Orders Floating Window */}
      <AnimatePresence>
        {showOrders && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 h-screen"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-black text-yellow-200 rounded-lg w-11/12 max-w-lg max-h-[80vh] relative flex flex-col"
            >
              {/* Fixed Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-yellow-400/30 sticky top-0 bg-black z-10">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock size={22} />
                  <h2 className="text-2xl font-bold">Your Past Orders</h2>
                </div>
                <button
                  onClick={() => setShowOrders(false)}
                  className="text-yellow-400 hover:text-yellow-500"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {loading ? (
                  <p>Loading...</p>
                ) : orders.length === 0 ? (
                  <p>No past orders found.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-yellow-400/30 rounded-lg p-3 cursor-pointer hover:bg-yellow-400/10"
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order.id ? null : order.id)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">Order #{order.order_number}</p>
                          {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        <p>Status: {order.status}</p>
                        <p className="text-sm text-yellow-400">
                          Date: {new Date(order.created_at).toLocaleString()}
                        </p>

                        {expandedOrder === order.id && (
                          <div className="mt-3 text-sm space-y-2">
                            {/* Items List */}
                            <ul className="list-disc pl-4">
                              {order.items?.map((item: any, index: number) => (
                                <li key={index}>
                                  {item.name} x {item.quantity}
                                </li>
                              ))}
                            </ul>

                            {/* Total Amount */}
                            <p className="text-yellow-400 font-semibold">
                              Total: ₹{order.total_amount}
                            </p>

                            {/* Payment Method */}
                            <p className="text-gray-300">
                              Payment Method: {order.payment_method?.toUpperCase()}
                            </p>

                            {/* Transaction ID */}
                            {order.transaction_id && (
                              <p className="text-gray-400 break-words">
                                Transaction ID: {order.transaction_id}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </motion.nav>
  )
}

export default Navbar
