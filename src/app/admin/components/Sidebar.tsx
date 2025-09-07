"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, FileText, Users, BarChart2, Settings, LogOut, X } from "lucide-react"
import { signOut } from "next-auth/react"

// Menu items array
const menuItems = [
  { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { name: "Managemen Produk", icon: List, path: "/admin/produk" },
  { name: "Managemen Kategori", icon: FileText, path: "/admin/kategori" },
  { name: "Managemen Pesanan", icon: Users, path: "/admin/pesanan" },
  { name: "Managemen Notifikasi", icon: BarChart2, path: "/admin/notifikasi" },
  { name: "Pengaturan", icon: Settings, path: "/admin/pengaturan" },
]

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  style?: React.CSSProperties;  // Tambahkan properti style
}

export default function Sidebar({ isOpen = false, onClose, onToggle, style }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex min-h-screen w-64 bg-white shadow-md flex-col z-50" style={style}>
        {/* Logo & Judul */}
        <div className="flex items-center gap-3 p-6 border-b">
          <div className="flex items-center">
            <img
              src="/LogoAdmin.png"
              alt="RegarMart Admin Logo"
              className="w-48 h-14 object-contain"
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col p-4 gap-2 flex-1">
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
          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all bg-red-100 text-red-700 font-semibold hover:bg-red-200 mt-auto"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={style}>
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b">
          <img
            src="/LogoAdmin.png"
            alt="RegarMart Admin Logo"
            className="h-10 object-contain"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col p-4 gap-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  isActive ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 rounded-r-full" />}
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-red-100 text-red-700 font-semibold hover:bg-red-200 mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </div>
    </>
  )
}
