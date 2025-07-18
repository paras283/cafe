import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Smartphone, Check } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: (paymentMethod: 'upi' | 'card' | 'cash') => void
  totalAmount: number
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  totalAmount 
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | null>(null)
  const [processing, setProcessing] = useState(false)
  const [upiId, setUpiId] = useState('')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  const handlePayment = async () => {
    if (!selectedMethod) return

    setProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      onPaymentSuccess(selectedMethod)
      onClose()
      // Reset form
      setSelectedMethod(null)
      setUpiId('')
      setCardDetails({ number: '', expiry: '', cvv: '', name: '' })
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 w-full max-w-md border border-yellow-400/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">Payment</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-yellow-400/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-yellow-400" />
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-black/50 rounded-lg p-4 border border-yellow-400/20">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-200">Total Amount:</span>
                    <span className="text-2xl font-bold text-yellow-400">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-yellow-400">Select Payment Method</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      selectedMethod === 'upi'
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-yellow-400/20 hover:border-yellow-400/40'
                    }`}
                  >
                    <Smartphone className="w-8 h-8 text-yellow-400" />
                    <span className="text-yellow-200 font-semibold">UPI</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod('card')}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      selectedMethod === 'card'
                        ? 'border-yellow-400 bg-yellow-400/10'
                        : 'border-yellow-400/20 hover:border-yellow-400/40'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 text-yellow-400" />
                    <span className="text-yellow-200 font-semibold">Card</span>
                  </motion.button>
                </div>
              </div>

              {selectedMethod === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <label className="block text-yellow-400 mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}

              {selectedMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <label className="block text-yellow-400 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-yellow-400 mb-2">Expiry</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                        placeholder="MM/YY"
                        className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-400 mb-2">CVV</label>
                      <input
                        type="text"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                        placeholder="123"
                        className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-yellow-400 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full p-3 bg-black/50 border border-yellow-400/20 rounded-lg text-yellow-200 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={!selectedMethod || processing}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-3 rounded-full font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Pay ₹{totalAmount}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal