import Link from "next/link"
import React from "react" 

export default function ProfilNavbar() {
  return (
    <nav className="left-0 top-0 w-full sticky bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-10 h-20">
        
        {/* Logo dan Teks */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-4">
            <img 
              src="/Logo.png" 
              alt="RegarMart Logo" 
              className="w-36 sm:w-48 h-12 sm:h-14 object-contain" 
            />

            <hr className="border-gray-200 my-3" />
          </Link>
          <div className="h-10 w-px bg-gray-300 mx-2"></div>
          <h1 className="text-xl font-normal text-green-600">Profil pengguna</h1>
        </div>
        
      </div>
    </nav>
  )
}