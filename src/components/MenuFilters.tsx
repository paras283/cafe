import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, Drumstick } from 'lucide-react'

interface MenuFiltersProps {
  selectedCategory: string
  selectedType: 'all' | 'veg' | 'non-veg'
  onCategoryChange: (category: string) => void
  onTypeChange: (type: 'all' | 'veg' | 'non-veg') => void
}

const MenuFilters: React.FC<MenuFiltersProps> = ({
  selectedCategory,
  selectedType,
  onCategoryChange,
  onTypeChange
}) => {
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'biryani', name: 'Biryani' },
    { id: 'momos', name: 'Momos' },
    { id: 'rolls', name: 'Rolls' },
    { id: 'shakes', name: 'Shakes' }
  ]

  const types = [
    { id: 'all', name: 'All', icon: null },
    { id: 'veg', name: 'Veg', icon: Leaf },
    { id: 'non-veg', name: 'Non-Veg', icon: Drumstick }
  ]

  return (
    <div className="mb-8 space-y-4">
      {/* Category filters */}
      <div>
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400/10'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Type filters */}
      <div>
        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Food Type</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTypeChange(type.id as 'all' | 'veg' | 'non-veg')}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-300 flex items-center gap-2 ${
                selectedType === type.id
                  ? 'bg-yellow-400 text-black border-yellow-400'
                  : 'bg-transparent text-yellow-400 border-yellow-400 hover:bg-yellow-400/10'
              }`}
            >
              {type.icon && <type.icon className="w-4 h-4" />}
              {type.name}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuFilters