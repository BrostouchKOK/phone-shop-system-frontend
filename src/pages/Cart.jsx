import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import { createOrder } from '../api/orderApi'
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingBag, FiMapPin, FiPhone } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // 📝 បង្កើត State សម្រាប់ចាប់ព័ត៌មានដឹកជញ្ជូនដែល Backend ត្រូវការដាច់ខាត (Required)
  const [shipping, setShipping] = useState({
    address: '',
    phone: ''
  })

  // គណនាតម្លៃសរុប
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShipping({ ...shipping, [name]: value })
  }

  const handleCheckout = async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      toast.error('សូមចូលប្រើប្រាស់គណនីរបស់អ្នកសិន ដើម្បីធ្វើការបញ្ជាទិញ!')
      navigate('/login')
      return
    }

    // 🛡️ បិទចន្លោះប្រហោង៖ ពិនិត្យមើលថាតើបំពេញអាសយដ្ឋាន និងលេខទូរស័ព្ទហើយឬនៅ
    if (!shipping.address.trim() || !shipping.phone.trim()) {
      toast.error('សូមបំពេញអាសយដ្ឋាន និងលេខទូរស័ព្ទរបស់អ្នកឱ្យបានត្រឹមត្រូវ!')
      return
    }

    setLoading(true)
    try {
      // 💡 រៀបចំទម្រង់ទិន្នន័យឱ្យត្រូវជាមួយ `req.body` របស់ Backend របស់អ្នក
      // សម្គាល់៖ ដោយសារ Backend របស់អ្នកទាញពី Cart DB 
      // ករណីនេះយើងបោះទាំង shippingAddress និងទិន្នន័យទំនិញទៅការពារ
      const orderData = {
        shippingAddress: {
          address: shipping.address,
          phone: shipping.phone
        },
        paymentMethod: "COD", // ត្រូវជាមួយ Default របស់ Backend OrderSchema
        products: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity
        }))
      }

      const response = await createOrder(orderData)

      if (response.data.success) {
        toast.success('🚀 ការបញ្ជាទិញរបស់លោកអ្នកទទួលបានជោគជ័យហើយ!')
        clearCart() // សម្អាតកន្ត្រកលើ Frontend ដែរ
        navigate('/') 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'មានបញ្ហាក្នុងការបញ្ជាទិញ!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-customBg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-8"> កន្ត្រកទំនិញរបស់អ្នក</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <FiShoppingBag className="mx-auto text-5xl text-gray-300 mb-4" />
            <p className="text-gray-400 font-medium text-sm sm:text-base">មិនទាន់មានទូរស័ព្ទដៃក្នុងកន្ត្រកទំនិញរបស់អ្នកឡើយ។</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-5 bg-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-purple-100 hover:bg-opacity-90">
              <FiArrowLeft /> ទៅទិញទំនិញឥឡូវនេះ
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* ឆ្វេង៖ បញ្ជីទំនិញក្នុងកន្ត្រក */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4 shadow-sm">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-customBg rounded-xl overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                    <img src={item.images?.[0]} alt={item.name} className="object-contain max-h-full" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary text-xs sm:text-sm md:text-base truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">ម៉ាក: {item?.brand}</p>
                    <p className="text-accent font-black text-sm sm:text-base mt-1">${item.price}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                    <div className="flex items-center border border-gray-100 rounded-lg bg-customBg overflow-hidden">
                      <button disabled={item.quantity <= 1} onClick={() => updateQuantity(item._id, -1)} className="px-2.5 py-1 text-gray-500 hover:bg-gray-200 text-xs font-bold cursor-pointer">
                        <FiMinus />
                      </button>
                      <span className="px-3 text-xs font-bold text-primary">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="px-2.5 py-1 text-gray-500 hover:bg-gray-200 text-xs font-bold cursor-pointer">
                        <FiPlus />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition p-2 cursor-pointer">
                      <FiTrash2 className="text-base sm:text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ស្តាំ៖ ផ្ទាំងបំពេញព័ត៌មានដឹកជញ្ជូន និង គិតលុយ */}
            <div className="space-y-6">
              {/* 🏠 ផ្ទាំងបំពេញអាសយដ្ឋាន (Shipping Form) */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-sm sm:text-base font-black text-primary flex items-center gap-2">
                  <FiMapPin className="text-accent" /> ព័ត៌មានដឹកជញ្ជូន
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">អាសយដ្ឋានរស់នៅបច្ចុប្បន្ន</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="address"
                        value={shipping.address}
                        onChange={handleInputChange}
                        placeholder="ឧទាហរណ៍៖ ផ្ទះលេខ ១២ ផ្លូវ ២៧១ ភ្នំពេញ" 
                        className="w-full bg-customBg border border-gray-100 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">លេខទូរស័ព្ទទំនាក់ទំនង</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="phone"
                        value={shipping.phone}
                        onChange={handleInputChange}
                        placeholder="ឧទាហរណ៍៖ 096XXXXXXX" 
                        className="w-full bg-customBg border border-gray-100 rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 💵 ផ្ទាំងគិតលុយ */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-sm sm:text-base font-black text-primary">សេចក្តីសង្ខេបការបញ្ជាទិញ</h2>
                <div className="space-y-2.5 text-xs sm:text-sm font-medium">
                  <div className="flex justify-between text-gray-400">
                    <span>តម្លៃទំនិញសរុប</span>
                    <span className="text-primary font-bold">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>សេវាដឹកជញ្ជូន</span>
                    <span className="text-emerald-500 font-bold">ហ្វ្រី (Free)</span>
                  </div>
                  <div className="w-full h-[1px] bg-gray-100 my-2"></div>
                  <div className="flex justify-between text-base font-black">
                    <span className="text-primary">ទឹកប្រាក់ត្រូវទូទាត់</span>
                    <span className="text-accent">${totalPrice}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="w-full bg-accent text-white font-bold py-3 px-4 rounded-xl transition duration-200 hover:bg-opacity-90 shadow-lg shadow-purple-200 text-xs sm:text-sm tracking-wide cursor-pointer mt-4 disabled:bg-gray-300 disabled:shadow-none"
                >
                  {loading ? 'កំពុងដំណើរការបញ្ជាទិញ...' : 'បញ្ជាក់ការបញ្ជាទិញ (COD)'}
                </button>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default Cart