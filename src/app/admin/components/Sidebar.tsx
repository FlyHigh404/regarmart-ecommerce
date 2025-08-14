"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, FileText, Users, BarChart2, Settings } from "lucide-react"

interface SidebarProps {
  title: string
  subtitle: string
}

const menuItems = [
  { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { name: "Managemen Produk", icon: List, path: "/admin/produk" },
  { name: "Managemen Kategori", icon: FileText, path: "/admin/kategori" },
  { name: "Managemen Pesanan", icon: Users, path: "/admin/pesanan" },
  { name: "Managemen Notifikasi", icon: BarChart2, path: "/admin/notifikasi" },
  { name: "Pengaturan", icon: Settings, path: "/admin/pengaturan" },
]

export default function Sidebar({ title, subtitle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="h-screen w-64 bg-white shadow-md flex flex-col">
      {/* Logo & Judul */}
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="flex items-center">
              <img
               src="/Logo.png"
               alt="RegarMart Logo"
               className="w-48 h-14 object-contain"
              />
              <p className="text-sm text-gray-500">{subtitle}</p>
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
              {/* Garis hijau di kiri */}
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full" />}
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {/* <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">U</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div> */}
    </div>
  )
}
