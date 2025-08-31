"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircle2, MapPin, Notebook, Lock, LogOut } from 'lucide-react';
import React from 'react';
import { signOut } from 'next-auth/react';

const navItems = [
  { name: 'Profil Saya', href: '/profil', icon: UserCircle2, children: ['/profil/editprofil'] },
  { name: 'Alamat', href: '/profil/alamat', icon: MapPin },
  { name: 'Riwayat Transaksi', href: '/profil/riwayat-transaksi', icon: Notebook, children: ['/profil/riwayat-transaksi/transaksi-diproses', '/profil/riwayat-transaksi/transaksi-selesai']},
  { name: 'Ubah Password', href: '/profil/ubah-password', icon: Lock},
];

export default function ProfilSide() {
  const pathname = usePathname();

  return (
    <div className="sticky w-[325px] h-[692px] flex-shrink-0">
      <div className="bg-white rounded-2xl p-6 h-full font-jakarta text-[#464255] text-[18px] font-normal">
        <h2 className="text-xl font-bold mb-6">Profil Pengguna</h2>
        <nav>
          <ul className="space-y-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                item.children?.some((child) => pathname.startsWith(child));

              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200
                        ${isActive 
                          ? 'bg-[rgba(0,176,116,0.15)] font-semibold border-l-4 border-l-[#26A81D]' 
                          : 'hover:bg-gray-100'
                        }
                      `}
                    >
                      <item.icon className={`h-6 w-6 ${isActive ? 'text-[#26A81D]' : 'text-gray-500'}`} />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left"
              >
                <div
                  className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-200 bg-red-100 text-red-500 transition-colors duration-200"
                >
                  <LogOut className="h-6 w-6 text-red-500" />
                  <span>Keluar</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
