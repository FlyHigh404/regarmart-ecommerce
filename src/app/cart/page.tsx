"use client"

import { useState } from "react"
import { Trash2, Minus, Plus } from "lucide-react"
import Footer from "@/components/Footer"
import NavKeranjang from "@/components/NavKeranjang"

interface CartItem {
  id: string
  name: string
  price: number
  stock: number
  quantity: number
  image: string
  selected: boolean
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
      price: 168500,
      stock: 29,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center",
      selected: true,
    },
    {
      id: "2",
      name: "Beras Fortune | Beras Premium | 5 Kilogram",
      price: 73500,
      stock: 120,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center",
      selected: true,
    },
    {
      id: "3",
      name: "Beras Sumo | Beras Premium | 3 Kilogram",
      price: 52500,
      stock: 8,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center",
      selected: true,
    },
  ])

  const selectedItems = cartItems.filter((item) => item.selected)
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = 4500
  const shippingEstimate = 22500
  const finalTotal = totalPrice - discount + shippingEstimate

  const handleSelectAll = (checked: boolean) => {
    setCartItems((items) => items.map((item) => ({ ...item, selected: checked })))
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, selected: checked } : item)))
  }

  const handleQuantityChange = (id: string, change: number) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change))
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const handleDeleteItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const handleDeleteSelected = () => {
    setCartItems((items) => items.filter((item) => !item.selected))
  }

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected)
  const selectedCount = selectedItems.length

  return (
    <>
      <NavKeranjang />
      <div className="bg-gray-50 pt-6 md:pt-10 pb-6 md:pb-10">
        <div className="max-w-5xl mx-auto px-4 md:px-0">
          <h2 className="text-lg md:text-xl ml-0 md:ml-2 font-bold mb-4 text-black">Daftar Produk</h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Product List Section */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl md:rounded-2xl">
                {/* Header */}
                <div className="p-3 md:p-4 border-b-8 md:border-b-14 border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 text-[#26A81D] bg-white border-2 border-[#26A81D] rounded focus:ring-[#26A81D]"
                        style={{ accentColor: "#26A81D" }}
                      />
                      <span className="text-xs md:text-sm font-medium">Pilih semua ({cartItems.length})</span>
                    </div>

                    {selectedCount > 0 && (
                      <button
                        onClick={handleDeleteSelected}
                        className="px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm font-medium text-[#26A81D] hover:text-[#1A7F16] hover:bg-[#D9F2D6] rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                {/* Product Items */}
                <div className="divide-y-8 md:divide-y-14 divide-gray-50">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-3 md:p-4 lg:p-5 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start gap-3 md:gap-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                          className="w-4 h-4 text-[#26A81D] bg-white border-2 border-[#26A81D] rounded focus:ring-[#26A81D] mt-1"
                        />

                        {/* Product Image */}
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info & Controls */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-3">
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-900 mb-1 text-xs md:text-sm line-clamp-2 leading-4 md:leading-5">
                                {item.name}
                              </h5>
                              <p className="text-xs text-[#26A81D] font-medium">Stok : {item.stock}</p>
                            </div>

                            {/* Price & Controls */}
                            <div className="flex flex-col items-start md:items-end gap-2">
                              <span className="text-sm md:text-base font-semibold text-gray-900">
                                Rp{item.price.toLocaleString("id-ID")}
                              </span>

                              <div className="flex items-center gap-2">
                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                </button>

                                {/* Quantity */}
                                <div className="flex items-center border border-gray-300 rounded-full bg-white">
                                  <button
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    disabled={item.quantity <= 1}
                                    className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-full"
                                  >
                                    <Minus className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-600" />
                                  </button>
                                  <div className="px-2 md:px-3 py-1 text-xs font-medium min-w-[1.5rem] md:min-w-[2rem] text-center">
                                    {item.quantity}
                                  </div>
                                  <button
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    disabled={item.quantity >= item.stock}
                                    className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-full"
                                  >
                                    <Plus className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 xl:sticky xl:top-4">
                <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-gray-900">Ringkasan Pesanan</h3>

                <div className="space-y-2 md:space-y-3 mb-4 md:mb-5 text-xs md:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total harga ({selectedCount} Produk)</span>
                    <span className="font-semibold text-gray-900">Rp{totalPrice.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Potongan Diskon</span>
                    <span className="font-semibold text-[#26A81D]">-Rp{discount.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estimasi Ongkir</span>
                    <span className="font-semibold text-gray-900">Rp{shippingEstimate.toLocaleString("id-ID")}</span>
                  </div>

                  <div className="border-t border-gray-300 border-dashed pt-2 md:pt-3">
                    <div className="flex justify-between items-center font-bold text-gray-900">
                      <span>Total Pesanan</span>
                      <span>Rp{finalTotal.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={selectedCount === 0}
                  className="w-full bg-[#26A81D] hover:bg-[#1A7F16] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 md:py-2.5 rounded-lg text-xs md:text-sm transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CartPage
