import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, UtensilsCrossed } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-black to-gray-900 py-16 px-4"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-yellow-400">FoodCourt</span>
            </div>
            <p className="text-yellow-200 mb-4">
              Experience the finest flavors with our premium selection of dishes, crafted with love and delivered with care.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-200">
                  123 Food Street, Culinary District, City - 400001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-200">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-200">Open: 10:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#menu" className="block text-yellow-200 hover:text-yellow-400 transition-colors">
                Menu
              </a>
              <a href="#about" className="block text-yellow-200 hover:text-yellow-400 transition-colors">
                About Us
              </a>
              <a href="#contact" className="block text-yellow-200 hover:text-yellow-400 transition-colors">
                Contact
              </a>
              <a href="#" className="block text-yellow-200 hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Our Specialties</h3>
            <div className="space-y-2">
              <p className="text-yellow-200">• Authentic Biryanis</p>
              <p className="text-yellow-200">• Fresh Momos</p>
              <p className="text-yellow-200">• Delicious Rolls</p>
              <p className="text-yellow-200">• Refreshing Shakes</p>
            </div>
          </div>
        </div>

        <div className="border-t border-yellow-400/20 mt-8 pt-8 text-center">
          <p className="text-yellow-200">
            © 2024 FoodCourt. All rights reserved. Made with ❤️ for food lovers.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer