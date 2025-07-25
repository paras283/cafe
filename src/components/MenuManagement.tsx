import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { MenuItem, supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const MenuManagement: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([])
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'biryani',
    is_veg: true
  })

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
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast.error('Failed to fetch menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const itemData = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        is_veg: formData.is_veg
      }

      if (editingItem) {
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id)

        if (error) throw error
        toast.success('Menu item updated successfully!')
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert(itemData)

        if (error) throw error
        toast.success('Menu item added successfully!')
      }

      resetForm()
      fetchMenuItems()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Failed to save menu item')
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      price: item.price.toString(),
      image: item.image,
      category: item.category,
      is_veg: item.is_veg
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Menu item deleted successfully!')
      fetchMenuItems()
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      image: '',
      category: 'biryani',
      is_veg: true
    })
    setEditingItem(null)
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-yellow-400">Loading menu items...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-yellow-400">Menu Management</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </motion.button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 rounded-lg p-4 border border-yellow-400/20 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-yellow-400">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h4>
            <button
              onClick={resetForm}
              className="p-1 hover:bg-yellow-400/10 rounded text-yellow-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-yellow-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-yellow-400 mb-2">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-yellow-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                >
                  <option value="biryani">Biryani</option>
                  <option value="momos">Momos</option>
                  <option value="rolls">Rolls</option>
                  <option value="shakes">Shakes</option>
                </select>
              </div>

              <div>
                <label className="block text-yellow-400 mb-2">Type</label>
                <select
                  value={formData.is_veg ? 'veg' : 'non-veg'}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_veg: e.target.value === 'veg' }))}
                  className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-yellow-400 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingItem ? 'Update' : 'Add'} Item
              </motion.button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/50 rounded-lg p-4 border border-yellow-400/20 flex items-center gap-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-400">{item.name}</h4>
              <p className="text-gray-300 text-sm capitalize">{item.category}</p>
              <p className="text-yellow-200">₹{item.price}</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                item.is_veg ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {item.is_veg ? 'Veg' : 'Non-Veg'}
              </span>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(item)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-yellow-200">No menu items found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MenuManagement