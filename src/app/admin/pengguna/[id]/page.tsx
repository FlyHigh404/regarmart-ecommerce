"use client"
import { useState } from "react"
import { ChevronLeft, ChevronDown, Funnel, Truck } from "lucide-react"
import AdminLayout from "../../AdminLayout"

const PenggunaDetailPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const orderData = [
    {
      id: 1,
      orderNumber: "#INV-0015",
      date: "23-08-2025 | 12:55",
      status: "completed",
      items: [
        {
          name: "Beras Raja Platinum | Beras Slyp Super Quality | 10 Kilogram",
          quantity: "Qty: x1",
          price: "Rp168.500",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center",
        },
        {
          name: "Beras Fortune | Beras Premium | 5 Kilogram",
          quantity: "Qty: x1",
          price: "Rp73.500",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center",
        },
        {
          name: "Beras Sumo | Beras Premium | 3 Kilogram",
          quantity: "Qty: x1",
          price: "Rp52.500",
          image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&h=100&fit=crop&crop=center",
        },
      ],
      total: "Rp292.500",
    },
  ]

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back Button - Outside main container */}
        <div className="bg-gray-50 px-6 py-4">
          <button className="flex items-center text-green-500 hover:text-green-700 transition-colors">
            <div className="w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center mr-3">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-lg font-medium text-green-500">Kembali</span>
          </button>
        </div>

        {/* Main Container with User Info, Filter and Order Details */}
        <div className="bg-white mx-6 rounded-t-lg">
          {/* User Info Section */}
          <div className="px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Riwayat pesanan</h2>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">LW</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Leasie Watson</span>
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Funnel className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div className="px-6 pb-6">
            {orderData.map((order) => (
              <div key={order.id} className="rounded-lg overflow-hidden">
                {/* Order Header */}
                <div className="py-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-600">No Pesanan : </span>
                    <span className="text-sm font-semibold text-blue-600">{order.orderNumber}</span>
                  </div>
                  <div className="bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-green-700">Pesanan selesai</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-4 py-2">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-5">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="py-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Truck className="text-green-500"/>
                    <span className="text-xs text-green-500">Pesanan telah tiba dan diterima customer</span>
                  </div>

                  <div className="flex justify-between items-end">
                    <p className="text-xs text-gray-500">{order.date}</p>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Total pesanan :</p>
                      <p className="text-xl font-bold text-gray-900">{order.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default PenggunaDetailPage