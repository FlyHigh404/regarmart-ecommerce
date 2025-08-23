"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function PasswordVerification() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")

  return (
    <div className="flex h-auto font-jakarta">
      <div className="bg-white rounded-2xl p-8 w-auto">
        {/* Judul */}
        <h3 className="text-[24px] font-semibold text-black mb-2">
          Masukkan Password Saat Ini
        </h3>
        <p className="text-[16px] font-normal text-black mb-6">
          Masukkan Password yang saat ini digunakan untuk proses verifikasi
        </p>

        {/* Input Password */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password saat ini"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[671px] h-[56px] rounded-lg border border-gray-300 px-4 pr-12 text-sm font-normal placeholder-[#8F8F8F] placeholder:text-[12px] placeholder:tracking-[-0.24px] focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Tombol Lanjutkan */}
        <div className="flex justify-end mt-4">
        <Link href="/profil/password-baru">
          <button className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg">
            Lanjutkan
          </button>
        </Link>
        </div>
      </div>
    </div>
  )
}
