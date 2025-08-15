"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, FileText, Users, BarChart2, Settings } from "lucide-react"

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { name: "Managemen Produk", icon: List, path: "/admin/produk" },
  { name: "Managemen Kategori", icon: FileText, path: "/admin/kategori" },
  { name: "Managemen Pesanan", icon: Users, path: "/admin/pesanan" },
  { name: "Managemen Notifikasi", icon: BarChart2, path: "/admin/notifikasi" },
  { name: "Pengaturan", icon: Settings, path: "/admin/pengaturan" },
]

export default function Sidebar () {
  const pathname = usePathname()

  return (
    <div className="min-h-screen w-64 bg-white shadow-md flex flex-col">
      {/* Logo & Judul */}
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="flex items-center">
              <img
               src="/LogoAdmin.png"
               alt="RegarMart Admin Logo"
               className="w-48 h-14 object-contain"
              />
          </div>
        <div>
        </div>
      </div>
    

      {/* Menu */}
      <nav className="flex flex-col p-4 gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all relative ${
                isActive ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full" />}
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
