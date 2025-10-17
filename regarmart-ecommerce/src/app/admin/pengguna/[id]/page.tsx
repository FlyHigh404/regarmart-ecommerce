"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronDown, Filter, Truck } from "lucide-react"
import AdminLayout from "../../AdminLayout"

interface Product {
  id: string
  name: string
  description: string
  price: string
  stock: number
  imageUrl: string[]
  categoryId: string
  createdAt: string
  updatedAt: string
}

interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: string
  product: Product
}

interface Order {
  id: string
  userId: string
  totalAmount: string
  status: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
}

interface CustomerDetail {
  id: string
  name: string
  email: string
  image: string | null
  phone: string | null
  address: string
  role: string
  createdAt: string
  updatedAt: string
  orders: Order[]
}

const PenggunaDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/customers/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch customer detail')
        }
        const data = await response.json()
        setCustomer(data)
      } catch (error) {
        console.error('Error fetching customer detail:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCustomerDetail()
    }
  }, [params.id])

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { bg: string; text: string; label: string } } = {
      COMPLETED: { bg: "bg-green-100", text: "text-green-700", label: "Pesanan selesai" },
      PROCESSING: { bg: "bg-blue-100", text: "text-blue-700", label: "Sedang diproses" },
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Menunggu pembayaran" },
      CANCELED: { bg: "bg-red-100", text: "text-red-700", label: "Dibatalkan" },
    }
    const statusInfo = statusMap[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status }
    return (
      <div className={`${statusInfo.bg} px-3 py-1 rounded-full`}>
        <span className={`text-xs font-medium ${statusInfo.text}`}>{statusInfo.label}</span>
      </div>
    )
  }

  const getStatusMessage = (status: string) => {
    const messageMap: { [key: string]: string } = {
      COMPLETED: "Pesanan telah tiba dan diterima customer",
      PROCESSING: "Pesanan sedang dalam proses pengiriman",
      PENDING: "Menunggu konfirmasi pembayaran",
      CANCELED: "Pesanan telah dibatalkan",
    }
    return messageMap[status] || "Status tidak diketahui"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}-${month}-${year} | ${hours}:${minutes}`
  }

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount)
    return `Rp${num.toLocaleString('id-ID')}`
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading customer data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Customer not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 text-green-500 hover:text-green-700"
            >
              Go back
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back Button */}
        <div className="bg-gray-50 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-green-500 hover:text-green-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center mr-3">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-lg font-medium text-green-500">Kembali</span>
          </button>
        </div>

        {/* Main Container */}
        <div className="bg-white mx-6 rounded-t-lg">
          {/* User Info Section */}
          <div className="px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Riwayat pesanan</h2>
                <div className="flex items-center space-x-3">
                  {customer.image ? (
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {getInitials(customer.name)}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-lg font-medium text-gray-900">{customer.name}</span>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Filter</span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div className="px-6 pb-6">
            {customer.orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">Tidak ada riwayat pesanan</p>
              </div>
            ) : (
              <div className="space-y-6">
                {customer.orders.map((order) => (
                  <div key={order.id} className="rounded-lg overflow-hidden border-b border-gray-200 pb-6">
                    {/* Order Header */}
                    <div className="py-4 flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600">No Pesanan : </span>
                        <span className="text-sm font-semibold text-blue-600">#{order.id.slice(0, 8)}</span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 py-2">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            {item.product.imageUrl && item.product.imageUrl.length > 0 ? (
                              <img
                                src={item.product.imageUrl[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-700">
                                  {getInitials(item.product.name)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 leading-5">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Qty: x{item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="py-4 mt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Truck className="text-green-500" />
                        <span className="text-xs text-green-500">
                          {getStatusMessage(order.status)}
                        </span>
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Metode Pembayaran: {order.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total pesanan :</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}>
            <div
              className="absolute top-32 right-4 sm:right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 max-w-[calc(100vw-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-medium text-gray-900 mb-3">Filter Pesanan</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent">
                    <option>Semua Status</option>
                    <option>Pesanan selesai</option>
                    <option>Sedang diproses</option>
                    <option>Menunggu pembayaran</option>
                    <option>Dibatalkan</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Terapkan
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default PenggunaDetailPage