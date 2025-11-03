"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, MapPin, FileText, Lock, Palette, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
  { name: "Profil Saya", href: "/profil", icon: User, children: ["/profil/editprofil"] },
  { name: "Alamat", href: "/profil/alamat", icon: MapPin },
  {
    name: "Riwayat Transaksi",
    href: "/profil/riwayat-transaksi",
    icon: FileText,
    children: ["/profil/riwayat-transaksi/transaksi-diproses", "/profil/riwayat-transaksi/transaksi-dikirim","/profil/riwayat-transaksi/transaksi-selesai","/profil/riwayat-transaksi/transaksi-dibatalkan",],
  },
  { name: "Ubah Password", href: "/profil/ubah-password", icon: Lock },
]

interface ProfilSideProps {
  onItemClick?: () => void
}

export default function ProfilSide({ onItemClick }: ProfilSideProps) {
  const pathname = usePathname()

  return (
    <div className="w-full md:w-[280px] flex-shrink-0">
      <div className="bg-white rounded-[15px] shadow-md border border-gray-100 overflow-hidden pt-2 pb-32">
        <nav className="flex flex-col p-4 gap-2 flex-1 relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href || item.children?.some((child) => pathname.startsWith(child))
            const Icon = item.icon

            return (
              <div key={item.name} className="relative">
                {/* Garis hijau terpisah di sisi kiri sidebar */}
                {isActive && (
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-green-600 rounded-r-full" />
                )}
                <Link href={item.href}>
                  <div
                    onClick={onItemClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                      isActive
                        ? "bg-green-100 text-green-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-green-700" : "text-gray-600"}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Link>
              </div>
            )
          })}
          <button
            onClick={() => {
              signOut({ callbackUrl: "/" })
              onItemClick?.()
            }}
            className="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 font-medium hover:bg-gray-100 hover:text-red-600 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </nav>
      </div>
    </div>
  )
}