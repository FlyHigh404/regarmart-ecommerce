"use client"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function PasswordVerification() {
  const [showPassword1, setShowPassword1] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")

  return (
    <div className="flex h-auto font-jakarta">
      <div className="bg-white rounded-2xl p-8 w-auto">
        {/* Judul */}
        <h3 className="text-[24px] font-semibold text-black mb-2">
          Buat Password Baru
        </h3>
        <p className="text-[16px] font-normal text-black mb-6">
          Masukkan Password baru yang nanti akan anda gunakan untuk Log In 
        </p>

        {/* Input Password Baru */}
        <div className="relative mb-6">
          <input
            type={showPassword1 ? "text" : "password"}
            placeholder="Password Baru"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="w-[671px] h-[56px] rounded-lg border border-gray-300 px-4 pr-12 text-sm font-normal placeholder-[#8F8F8F] placeholder:text-[12px] placeholder:tracking-[-0.24px] focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword1(!showPassword1)}
          >
            {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Input Konfirmasi Password */}
        <div className="relative mb-6">
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Konfirmasi Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-[671px] h-[56px] rounded-lg border border-gray-300 px-4 pr-12 text-sm font-normal placeholder-[#8F8F8F] placeholder:text-[12px] placeholder:tracking-[-0.24px] focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword2(!showPassword2)}
          >
            {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Tombol Konfirmasi */}
        <div className="flex justify-end mt-4">
          <button className="bg-green-500 text-white font-bold hover:bg-green-700 py-2 px-6 rounded-lg">
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  )
}
