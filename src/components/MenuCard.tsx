import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Leaf } from 'lucide-react'
import { MenuItem } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'

interface MenuCardProps {
  item: MenuItem
  index: number
}

const MenuCard: React.FC<MenuCardProps> = ({ item, index }) => {
  const { addToCart, cart, updateQuantity } = useCart()

  const cartItem = cart.find(cartItem => cartItem.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      is_veg: item.is_veg
    })
  }

  const handleIncrement = () => {
    if (quantity === 0) {
      handleAddToCart()
    } else {
      updateQuantity(item.id, quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-yellow-400/20 w-full"
      style={{
        transform: 'perspective(1000px) rotateY(2deg)',
        boxShadow: '0 10px 30px rgba(251, 191, 36, 0.1)'
      }}
    >
      <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          {item.is_veg ? (
            <div className="bg-green-500 p-1 rounded-full">
              <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
          ) : (
            <div className="bg-red-500 p-1 rounded-full">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-lg md:text-xl font-bold text-yellow-400 mb-1 sm:mb-2 line-clamp-2">{item.name}</h3>
        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 capitalize">{item.category}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">₹{item.price}</span>
          {quantity === 0 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full font-semibold flex items-center gap-1 sm:gap-2 hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              Add
            </motion.button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrement}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
              <span className="w-6 sm:w-8 text-center text-yellow-400 font-semibold text-sm sm:text-base">
                {quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrement}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MenuCard