import React from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed, ShoppingCart, User } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

interface NavbarProps {
  onCartClick: () => void
  onAdminClick: () => void
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick, onAdminClick }) => {
  const { getTotalItems } = useCart()

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-yellow-400/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-yellow-400">FoodCourt</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-yellow-200 hover:text-yellow-400 transition-colors">
              Menu
            </a>
            <a href="#about" className="text-yellow-200 hover:text-yellow-400 transition-colors">
              About
            </a>
            <a href="#contact" className="text-yellow-200 hover:text-yellow-400 transition-colors">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-4">
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAdminClick}
              className="p-2 border border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-black transition-colors"
            >
              <User className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar