import React, { useState, useEffect } from 'react'
import {AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './contexts/CartContext'
import { OrderProvider } from './contexts/OrderContext'
import LoadingLogo from './components/LoadingLogo'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import OrderStatus from './components/OrderStatus'
import Menu from './components/Menu'
import Cart from './components/Cart'
import Footer from './components/Footer'
import AdminPanel from './components/AdminPanel'

const AppContent: React.FC = () => {
  const [showLoading, setShowLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)

  const handleLoadingComplete = () => {
    setShowLoading(false)
  }

  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.href && target.href.includes('#')) {
        e.preventDefault()
        const id = target.href.split('#')[1]
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    document.addEventListener('click', handleSmoothScroll)
    return () => document.removeEventListener('click', handleSmoothScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fbbf24',
            border: '1px solid #fbbf24',
          },
        }}
      />

      <AnimatePresence>
        {showLoading && (
          <LoadingLogo onAnimationComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {!showLoading && (
        <div>
          <Navbar
            onCartClick={() => setIsCartOpen(true)}
            onAdminClick={() => setIsAdminOpen(true)}
          />
          <Hero />
          <OrderStatus />
          <Menu />
          <Footer />
          
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
          />
          <AdminPanel
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </CartProvider>
  )
}

export default App