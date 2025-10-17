"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../AdminLayout"
import { Filter, ChevronDown } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useRouter } from "next/navigation"

interface Address {
  id: string
  userId: string
  recipientName: string
  phoneNumber: string
  label: string
  fullAddress: string
  note: string
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

interface Order {
  id: string
  userId: string
  totalAmount: string
  status: string
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

interface Customer {
  id: string
  name: string
  email: string
  emailVerified: string | null
  image: string | null
  phone: string | null
  address: string | null
  role: string
  password: string
  createdAt: string
  updatedAt: string
  orders: Order[]
  Address: Address[]
}

const Pengguna = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Fetch customers data from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/customers')
        if (!response.ok) {
          throw new Error('Failed to fetch customers')
        }
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.error('Error fetching customers:', error)
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load customers data.',
          icon: 'error',
          customClass: {
            popup: 'rounded-xl',
            confirmButton: 'rounded-lg px-4 py-2',
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customer.Address.some((addr) => 
        addr.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())
      )

    return matchesSearch
  })

  const handleDeleteCustomer = async (customerId: string) => {
    const MySwal = withReactContent(Swal)

    MySwal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg px-4 py-2",
        cancelButton: "rounded-lg px-4 py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCustomers((prev) => prev.filter((customer) => customer.id !== customerId))
        MySwal.fire({
          title: "Deleted!",
          text: "Customer has been deleted successfully.",
          icon: "success",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "rounded-lg px-4 py-2",
          },
        })
      }
    })
  }

  const handlePreviewCustomer = (customer: { id: string }) => {
  router.push(`/admin/pengguna/${customer.id}`)
}

  // Helper function to get primary address or first address
  const getCustomerAddress = (customer: Customer): string => {
    if (!customer.Address || customer.Address.length === 0) {
      return customer.address || 'Alamat tidak tersedia'
    }
    const primaryAddress = customer.Address.find((addr) => addr.isPrimary)
    const address = primaryAddress || customer.Address[0]
    return address.fullAddress || 'Alamat tidak tersedia'
  }

  // Helper function to get phone number
  const getCustomerPhone = (customer: Customer): string => {
    if (customer.phone) return customer.phone
    if (customer.Address && customer.Address.length > 0) {
      const primaryAddress = customer.Address.find((addr) => addr.isPrimary)
      return primaryAddress?.phoneNumber || customer.Address[0]?.phoneNumber || '-'
    }
    return '-'
  }

  if (loading) {
    return (
      <AdminLayout>
        <main className="flex-1 bg-gray-50 pt-3">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading customers...</p>
            </div>
          </div>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-3">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:pt-6 sm:pb-0 bg-white">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tabel customers</h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">Ini adalah daftar data customers</p>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3 mr-3">
                <div className="relative order-2 sm:order-2">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 sm:gap-3 transition-colors text-sm w-full sm:w-auto"
                  >
                    <Filter className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="block lg:hidden space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={customer.image || "/placeholder.svg"}
                          alt={customer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{customer.name}</h3>
                          <p className="text-gray-600 text-xs">{getCustomerPhone(customer)}</p>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2">{getCustomerAddress(customer)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => handlePreviewCustomer(customer)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="View"
                      >
                        <img src="/receipt-item.png" alt="View" className="" width="30"/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">Tidak ada customer ditemukan</p>
                  <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                </div>
              )}
            </div>

            <div className="hidden lg:block overflow-x-auto rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      PELANGGAN
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      ALAMAT
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      NO TELPON
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 uppercase text-xs tracking-wider">
                      TINDAKAN
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={`hover:bg-gray-100 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={customer.image || "/placeholder.svg"}
                            alt={customer.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-gray-900 text-sm font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 max-w-xs">
                        <span className="text-gray-600 text-sm line-clamp-2">{getCustomerAddress(customer)}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-900 text-sm font-medium">{getCustomerPhone(customer)}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handlePreviewCustomer(customer)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="View"
                          >
                            <img src="/receipt-item.png" alt="View" className="" width="30"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 px-6 text-center bg-white">
                        <div className="text-gray-500">
                          <p className="text-lg font-medium">Tidak ada customer ditemukan</p>
                          <p className="text-sm mt-1">Coba ubah kata kunci pencarian Anda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {showFilter && (
          <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)}>
            <div
              className="absolute top-32 right-4 sm:right-8 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-64 max-w-[calc(100vw-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-medium text-gray-900 mb-3">Filter Customer</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Lokasi</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent">
                    <option>Semua Lokasi</option>
                    <option>Sidoarjo</option>
                    <option>Surabaya</option>
                    <option>Malang</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Terapkan
                  </button>
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setShowFilter(false)}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  )
}

export default Pengguna