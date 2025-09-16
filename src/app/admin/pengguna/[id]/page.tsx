"use client"
import { useState } from "react"
import { ChevronLeft, Search, Filter, Check } from "lucide-react"
import AdminLayout from "../../AdminLayout"

const PenggunaDetailPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const orderData = [
    {
      id: 1,
      orderNumber: "#INV-0015",
      date: "23-08-2023 | 12:55",
      status: "completed",
      items: [
        {
          name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
          quantity: "Qty: x1",
          price: "Rp168.500",
          image: "/rice-bag-premium.jpg",
        },
        {
          name: "Beras Fortune | Beras Premium | 5 Kilogram",
          quantity: "Qty: x1",
          price: "Rp73.500",
          image: "/rice-bag-fortune.jpg",
        },
        {
          name: "Beras Sumo | Beras Premium | 3 Kilogram",
          quantity: "Qty: x1",
          price: "Rp52.500",
          image: "/rice-bag-sumo.jpg",
        },
      ],
      total: "Rp292.500",
    },
    {
      id: 2,
      orderNumber: "#INV-0015",
      date: "23-08-2023 | 12:55",
      status: "completed",
      items: [
        {
          name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
          quantity: "Qty: x1",
          price: "Rp168.500",
          image: "/rice-bag-premium.jpg",
        },
        {
          name: "Beras Fortune | Beras Premium | 5 Kilogram",
          quantity: "Qty: x1",
          price: "Rp73.500",
          image: "/rice-bag-fortune.jpg",
        },
        {
          name: "Beras Sumo | Beras Premium | 3 Kilogram",
          quantity: "Qty: x1",
          price: "Rp52.500",
          image: "/rice-bag-sumo.jpg",
        },
      ],
      total: "Rp292.500",
    },
  ]

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="px-6 py-4">
            <button className="flex items-center text-green-600 hover:text-green-700 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-1 font-medium">Kembali</span>
            </button>
          </div>
        </div>

        <div className="bg-white border-b border-gray-100">
          <div className="px-6 py-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-600">LW</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Riwayat pesanan</p>
                <p className="text-lg font-semibold text-gray-900">Leasie Watson</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-sm"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors"
              >
                <Filter className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {orderData.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">No Pesanan:</span>
                  <span className="text-sm font-semibold text-blue-600">{order.orderNumber}</span>
                </div>
                <div className="bg-green-100 px-3 py-1.5 rounded-full">
                  <span className="text-xs font-medium text-green-700">Pesanan selesai</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 space-y-4">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-5 mb-1">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">Pesanan telah tiba dan diterima customer</span>
                </div>

                <div className="flex justify-between items-end">
                  <p className="text-xs text-gray-500">{order.date}</p>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Total pesanan:</p>
                    <p className="text-lg font-bold text-gray-900">{order.total}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}

export default PenggunaDetailPage
