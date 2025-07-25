import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, LogIn, LogOut, Settings, List, Archive, Calendar, Plus, Minus } from 'lucide-react'
import { supabase, Order, MenuItem } from '../lib/supabase'
import MenuManagement from './MenuManagement'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid';

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

// Create Order Form Component
const CreateOrderForm: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      toast.error('Failed to fetch menu items')
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      const newSelected = { ...selectedItems }
      delete newSelected[itemId]
      setSelectedItems(newSelected)
    } else {
      setSelectedItems(prev => ({ ...prev, [itemId]: quantity }))
    }
  }

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(i => i.id === itemId)
      return total + (item ? item.price * quantity : 0)
    }, 0)
  }

  const handleCreateOrder = async () => {
    if (Object.keys(selectedItems).length === 0) {
      toast.error('Please select at least one item')
      return
    }

    if (!customerName.trim()) {
      toast.error('Please enter customer name')
      return
    }

    setLoading(true)
    try {
      const orderItems = Object.entries(selectedItems).map(([itemId, quantity]) => {
        const item = menuItems.find(i => i.id === itemId)!
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          image: item.image,
          is_veg: item.is_veg
        }
      })

      const customerId = 'admin_' + Date.now()
      const orderNumber = 'ORD' + Date.now().toString().slice(-6)

      const { error } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          items: orderItems,
          total_amount: calculateTotal(),
          status: 'preparing',
          payment_method: 'cash',
          transaction_id: '756488735546473'
        })

      if (error) throw error

      toast.success(`Order ${orderNumber} created successfully!`)
      setSelectedItems({})
      setCustomerName('')
    } catch (error) {
      toast.error('Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-yellow-400 mb-4">Create Cash Order</h3>

      <div className="mb-4">
        <label className="block text-yellow-400 mb-2">Customer Name</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
          placeholder="Enter customer name"
        />
      </div>

      <div className="grid gap-4 mb-6 max-h-96 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-black/50 p-3 rounded-lg border border-yellow-400/20">
            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <h4 className="text-yellow-400 font-semibold">{item.name}</h4>
              <p className="text-yellow-200">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, (selectedItems[item.id] || 0) - 1)}
                className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center hover:bg-yellow-500"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-yellow-400 font-semibold">
                {selectedItems[item.id] || 0}
              </span>
              <button
                onClick={() => updateQuantity(item.id, (selectedItems[item.id] || 0) + 1)}
                className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center hover:bg-yellow-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xl font-bold text-yellow-400">Total: ₹{calculateTotal()}</span>
        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">Cash Payment</span>
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={loading || Object.keys(selectedItems).length === 0 || !customerName.trim()}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-orange-500 transition-all duration-300"
      >
        {loading ? 'Creating Order...' : 'Create Cash Order'}
      </button>
    </div>
  )
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [completedOrders, setCompletedOrders] = useState<Order[]>([])
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(false)


  type TabKey = 'orders' | 'menu' | 'completed' | 'create-order';
  const [activeTab, setActiveTab] = useState<TabKey>('orders');


  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsAuthenticated(true)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchOrders()
      fetchCompletedOrders()
    }
  }, [isOpen, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return;

    const instanceId = uuidv4();
    const LEADER_KEY = 'admin-broadcast-leader';

    // Elect current instance as leader if none
    if (!localStorage.getItem(LEADER_KEY)) {
      localStorage.setItem(LEADER_KEY, instanceId);
    }

    const isLeader = () => localStorage.getItem(LEADER_KEY) === instanceId;

    const handleStorageChange = () => {
      // Recheck leader status when storage changes
      if (!localStorage.getItem(LEADER_KEY)) {
        localStorage.setItem(LEADER_KEY, instanceId);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const broadcastChannel = supabase.channel('orders-broadcast');
    broadcastChannel.subscribe((status) => {
      console.log('📡 Broadcast channel status:', status);
    });

    const postgresChannel = supabase
      .channel('admin-orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        async (payload) => {
          console.log('🧩 Admin Postgres payload:', payload);

          const updatedOrder = payload.new as Order;

          // ✅ Only leader broadcasts to customers
          if (isLeader() && payload.eventType === 'UPDATE' && updatedOrder.customer_id) {
            await broadcastChannel.send({
              type: 'broadcast',
              event: 'order_update',
              payload: {
                order: updatedOrder,
                customer_id: updatedOrder.customer_id,
              },
            });
          }

          // ✅ Update admin panel UI
          if (payload.eventType === 'INSERT') {
            if (updatedOrder.status !== 'completed') {
              setOrders((prev) => [updatedOrder, ...prev.filter((o) => o.id !== updatedOrder.id)]);
            }
          } else if (payload.eventType === 'UPDATE') {
            if (updatedOrder.status === 'completed') {
              setOrders((prev) => prev.filter((o) => o.id !== updatedOrder.id));
              setCompletedOrders((prev) => [updatedOrder, ...prev.filter((o) => o.id !== updatedOrder.id)]);
            } else {
              setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)));
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('✅ Subscribed to Postgres changes_:', status);
      });

    // Cleanup on unmount
    return () => {
      if (isLeader()) {
        localStorage.removeItem(LEADER_KEY);
      }

      window.removeEventListener('storage', handleStorageChange);
      supabase.removeChannel(postgresChannel);
      supabase.removeChannel(broadcastChannel);
    };
  }, [isAuthenticated]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setIsAuthenticated(true)
      toast.success('Admin login successful!')
    } catch (error) {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Logout error (can be ignored):', error)
    }
    setIsAuthenticated(false)
    setEmail('')
    setPassword('')
    setShowLogoutConfirm(false)
    toast.success('Logged out successfully')
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .neq('status', 'completed')
        .order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      toast.error('Failed to fetch orders')
    }
  }

  const fetchCompletedOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (dateFilter) {
        const start = new Date(dateFilter)
        const end = new Date(dateFilter)
        end.setDate(end.getDate() + 1)
        query = query
          .gte('completed_at', start.toISOString())
          .lt('completed_at', end.toISOString())
      }

      const { data, error } = await query
      if (error) throw error
      setCompletedOrders(data || [])
    } catch (error) {
      toast.error('Failed to fetch completed orders')
    }
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === 'completed') {
      fetchCompletedOrders()
    }
  }, [dateFilter, isAuthenticated, activeTab])

  const updateOrderStatus = async (
    orderId: string,
    newStatus: 'preparing' | 'ready' | 'delivered' | 'completed'
  ) => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
      if (error) throw error


      toast.success(`Order updated to ${newStatus}`)
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-500'
      case 'ready': return 'bg-green-500'
      case 'delivered': return 'bg-blue-500'
      case 'completed': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  return (
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
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border-l border-yellow-400/20 z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-yellow-400/20 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-400">Admin Panel</h2>
                <div className="flex gap-2">
                  {isAuthenticated && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-yellow-400/10 rounded-full"
                  >
                    <X className="w-6 h-6 text-yellow-400" />
                  </motion.button>
                </div>
              </div>

              {/* Logout Confirmation Modal */}
              <AnimatePresence>
                {showLogoutConfirm && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/50 z-[60]"
                      onClick={cancelLogout}
                    />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                    >
                      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 w-full max-w-sm border border-red-400/20 shadow-2xl">
                        <div className="text-center mb-6">
                          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-8 h-8 text-red-400" />
                          </div>
                          <h3 className="text-xl font-bold text-red-400 mb-2">Confirm Logout</h3>
                          <p className="text-gray-300">
                            Are you sure you want to logout from the admin panel?
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={cancelLogout}
                            className="flex-1 bg-gray-600 text-white py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={confirmLogout}
                            className="flex-1 bg-red-500 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
                          >
                            Logout
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {!isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                  >
                    <div className="text-center mb-6">
                      <LogIn className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-yellow-400 mb-2">Admin Login</h3>
                      <p className="text-yellow-200">Enter your credentials to access the admin panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-yellow-400 mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-yellow-400 mb-2">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 pr-10 focus:border-yellow-400 focus:outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-yellow-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-3 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex mb-6 border-b border-yellow-400/20">
                      {([
                        ['orders', <List className="w-4 h-4" />, 'Active Orders'],
                        ['menu', <Settings className="w-4 h-4" />, 'Menu Management'],
                        ['completed', <Archive className="w-4 h-4" />, 'Completed Orders'],
                        ['create-order', <Plus className="w-4 h-4" />, 'Create Order'],
                      ] as [TabKey, JSX.Element, string][]).map(([key, icon, label]) => (
                        <button
                          key={key}
                          onClick={() => setActiveTab(key)}
                          className={`flex items-center gap-2 px-4 py-2 font-semibold transition-colors ${activeTab === key
                            ? 'text-yellow-400 border-b-2 border-yellow-400'
                            : 'text-yellow-200 hover:text-yellow-400'
                            }`}
                        >
                          {icon}
                          {label}
                        </button>
                      ))}
                    </div>


                    {/* Active tab content */}
                    {activeTab === 'orders' && (
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400 mb-4">Order Management</h3>
                        {orders.map((order) => (
                          <div key={order.id} className="mb-4 p-4 rounded bg-black/50 border border-yellow-400/20">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-yellow-400 font-bold">{order.order_number}</h4>
                              <span className={`px-3 py-1 text-sm rounded-full text-white ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-sm text-yellow-200 mb-2">
                              {order.items.map((item, i) => (
                                <div key={i}>{item.quantity}x {item.name} - ₹{item.price * item.quantity}</div>
                              ))}
                            </div>
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                              <span>Total: ₹{order.total_amount}</span>
                              <span className="capitalize bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                {order.payment_method}
                              </span>
                              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                                ID: {order.transaction_id}
                              </span>
                              <span>{new Date(order.created_at).toLocaleString()}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {['preparing', 'ready', 'delivered', 'completed'].map(status => (
                                <button
                                  key={status}
                                  disabled={order.status === status}
                                  onClick={() => updateOrderStatus(order.id, status as any)}
                                  className={`rounded-full px-3 py-1 font-semibold ${getStatusColor(status)
                                    } text-white disabled:opacity-50`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        {orders.length === 0 && (
                          <p className="text-yellow-200 text-center py-6">No active orders</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'menu' && <MenuManagement />}

                    {activeTab === 'completed' && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-yellow-400">Completed Orders</h3>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                            <input
                              type="date"
                              value={dateFilter}
                              onChange={(e) => setDateFilter(e.target.value)}
                              className="bg-black/50 border border-yellow-400/20 rounded px-3 py-1 text-yellow-200"
                            />
                          </div>
                        </div>
                        {completedOrders.map((order) => (
                          <div key={order.id} className="mb-4 p-4 rounded bg-black/50 border border-yellow-400/20">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-yellow-400 font-bold">{order.order_number}</h4>
                              <span className="px-3 py-1 text-sm rounded-full bg-gray-500 text-white">Completed</span>
                            </div>
                            <div className="text-sm text-yellow-200 mb-2">
                              {order.items.map((item, i) => (
                                <div key={i}>{item.quantity}x {item.name} - ₹{item.price * item.quantity}</div>
                              ))}
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>Total: ₹{order.total_amount}</span>
                              <span className="capitalize bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                {order.payment_method}
                              </span>
                              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                                ID: {order.transaction_id}
                              </span>
                              <span>
                                {typeof order.completed_at === 'string'
                                  ? new Date(order.completed_at).toLocaleString()
                                  : 'N/A'}
                              </span>

                            </div>
                          </div>
                        ))}
                        {completedOrders.length === 0 && (
                          <p className="text-yellow-200 text-center py-6">No completed orders</p>
                        )}
                      </div>
                    )}

                    {activeTab === 'create-order' && (
                      <CreateOrderForm />
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AdminPanel