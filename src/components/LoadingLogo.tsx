import React from 'react'
import { motion } from 'framer-motion'
import { UtensilsCrossed } from 'lucide-react'

interface LoadingLogoProps {
  onAnimationComplete: () => void
}

const LoadingLogo: React.FC<LoadingLogoProps> = ({ onAnimationComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => setTimeout(onAnimationComplete, 2000)}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))'
          }}
        >
          <UtensilsCrossed className="w-12 h-12 text-black" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-yellow-400 mb-2"
        >
          FoodCourt
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-yellow-200 text-lg"
        >
          Delicious food delivered
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default LoadingLogo