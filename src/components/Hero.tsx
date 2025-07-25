import React from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with gradient and lighting effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl mb-6"
               style={{
                 filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.5))',
                 transform: 'perspective(1000px) rotateY(15deg)'
               }}>
            <UtensilsCrossed className="w-16 h-16 text-black" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-5xl md:text-7xl font-bold text-yellow-400 mb-6 leading-tight"
        >
          Welcome to
          <br />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            FoodCourt
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl md:text-2xl text-yellow-200 mb-8 max-w-2xl mx-auto"
        >
          Experience the finest flavors with our premium selection of biryanis, momos, rolls, and shakes
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <a
            href="#menu"
            className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-full font-semibold text-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            Explore Menu
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-yellow-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-yellow-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default Hero