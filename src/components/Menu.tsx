import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MenuItem, supabase } from '../lib/supabase'
import MenuFilters from './MenuFilters'
import MenuCard from './MenuCard'

const Menu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState<'all' | 'veg' | 'non-veg'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenuItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, selectedCategory, selectedType])

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => 
        selectedType === 'veg' ? item.is_veg : !item.is_veg
      )
    }

    setFilteredItems(filtered)
  }

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black" id="menu">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-yellow-400">Loading menu...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-20 px-4 bg-gradient-to-br from-black via-gray-900 to-black"
      id="menu"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
            Our Menu
          </h2>
          <p className="text-xl text-yellow-200 max-w-2xl mx-auto">
            Discover our delicious selection of freshly prepared dishes
          </p>
        </motion.div>

        <MenuFilters
          selectedCategory={selectedCategory}
          selectedType={selectedType}
          onCategoryChange={setSelectedCategory}
          onTypeChange={setSelectedType}
        />

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {filteredItems.map((item, index) => (
            <MenuCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-yellow-200 text-lg">
              No items found matching your filters
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

export default Menu