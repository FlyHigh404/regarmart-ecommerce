"use client"
import { useState } from "react"
import AdminLayout from "../AdminLayout"
import { Search, Trash2, Filter, ChevronDown, Eye, X, Phone, MapPin, User } from "lucide-react"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

// Sample customer data - replace with your actual data source
const sampleCustomers = [
  {
    id: "CUST-001",
    name: "Leasie Watson",
    avatar: "/woman-profile.png",
    address: "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
    phone: "089536057489",
  },
  {
    id: "CUST-002",
    name: "Floyd Miles",
    avatar: "/man-profile.png",
    address: "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
    phone: "089536057489",
  },
  {
    id: "CUST-003",
    name: "Theresa Webb",
    avatar: "/woman-profile-two.png",
    address: "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
    phone: "089536057489",
  },
]

const Pengguna = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilter, setShowFilter] = useState(false)
  const [customers, setCustomers] = useState(sampleCustomers)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase())

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

  const handlePreviewCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setShowPreview(true)
  }

  const closePreview = () => {
    setShowPreview(false)
    setSelectedCustomer(null)
  }

  return (
    <AdminLayout>
      <main className="flex-1 bg-gray-50 pt-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:pt-6 sm:pb-0 bg-white">
            <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tabel customers</h1>
                <p className="text-gray-500 text-sm sm:text-base mt-1">Ini adalah daftar data customers</p>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <div className="relative order-1 sm:order-1">
                  <Search
                    className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent w-full sm:w-64 lg:w-80 bg-white text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

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
                          src={customer.avatar || "/placeholder.svg"}
                          alt={customer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm">{customer.name}</h3>
                          <p className="text-gray-600 text-xs">{customer.phone}</p>
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2">{customer.address}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => handlePreviewCustomer(customer)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                        title="View"
                      >
                        <img src="/receipt-item.png" alt="receipt" />
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
                            src={customer.avatar || "/placeholder.svg"}
                            alt={customer.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-gray-900 text-sm font-medium">{customer.name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 max-w-xs">
                        <span className="text-gray-600 text-sm line-clamp-2">{customer.address}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-gray-900 text-sm font-medium">{customer.phone}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handlePreviewCustomer(customer)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="View"
                          >
                            <img src="/receipt-item.png" alt="receipt" />
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

        {showPreview && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Customer</h2>
                <button
                  onClick={closePreview}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Detail customer</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Nama</label>
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center gap-3">
                      <img
                        src={selectedCustomer.avatar || "/placeholder.svg"}
                        alt={selectedCustomer.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-gray-900 font-medium">{selectedCustomer.name}</span>
                      <User className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">Alamat</label>
                    <div className="relative">
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent resize-none"
                        rows={3}
                        defaultValue={selectedCustomer.address}
                        readOnly
                      />
                      <MapPin className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-600 mb-1">No Telpon</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none focus:border-transparent"
                        defaultValue={selectedCustomer.phone}
                        readOnly
                      />
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={closePreview}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Kembali
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
