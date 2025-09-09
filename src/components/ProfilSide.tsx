"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserCircle2, MapPin, Notebook, Lock, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const navItems = [
  { name: "Profil Saya", href: "/profil", icon: UserCircle2, children: ["/profil/editprofil"] },
  { name: "Alamat", href: "/profil/alamat", icon: MapPin },
  {
    name: "Riwayat Transaksi",
    href: "/profil/riwayat-transaksi",
    icon: Notebook,
    children: ["/profil/riwayat-transaksi/transaksi-diproses", "/profil/riwayat-transaksi/transaksi-selesai"],
  },
  { name: "Ubah Password", href: "/profil/ubah-password", icon: Lock },
]

interface ProfilSideProps {
  onItemClick?: () => void
}

export default function ProfilSide({ onItemClick }: ProfilSideProps) {
  const pathname = usePathname()

  return (
    <div className="w-full md:w-[325px] md:h-[692px] flex-shrink-0">
      <div className="bg-white rounded-2xl p-4 md:p-6 h-full font-jakarta text-[#464255] text-[16px] md:text-[18px] font-normal">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Profil Pengguna</h2>
        <nav>
          <ul className="space-y-3 md:space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || item.children?.some((child) => pathname.startsWith(child))

              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      onClick={onItemClick}
                      className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors duration-200
                        ${
                          isActive
                            ? "bg-[rgba(0,176,116,0.15)] font-semibold border-l-4 border-l-[#26A81D]"
                            : "hover:bg-gray-100"
                        }
                      `}
                    >
                      <item.icon className={`h-5 w-5 md:h-6 md:w-6 ${isActive ? "text-[#26A81D]" : "text-gray-500"}`} />
                      <span className="text-sm md:text-base">{item.name}</span>
                    </div>
                  </Link>
                </li>
              )
            })}
            <li>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" })
                  onItemClick?.() 
                }}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-lg hover:bg-red-200 bg-red-100 text-red-500 transition-colors duration-200">
                  <LogOut className="h-5 w-5 md:h-6 md:w-6 text-red-500" />
                  <span className="text-sm md:text-base">Keluar</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
