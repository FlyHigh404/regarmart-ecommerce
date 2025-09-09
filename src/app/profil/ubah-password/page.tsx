"use client"
import { useState } from "react"
import type React from "react"

import { Eye, EyeOff } from "lucide-react"

export default function UbahPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = () => {
    console.log("Password diubah:", formData)
  }

  return (
    <div className="w-full max-w-[756px] bg-white p-4 md:p-8 rounded-xl shadow font-jakarta">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-6">Ubah Password</h2>

      <div className="space-y-4 md:space-y-6">
        {/* Password Saat Ini */}
        <div className="relative">
          <input
            type={showPassword.current ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 pt-3 focus:border-green-600 text-sm md:text-base"
            placeholder="Masukkan password saat ini"
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("current")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password Baru */}
        <div className="relative">
          <input
            type={showPassword.new ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 pt-3 focus:border-green-600 text-sm md:text-base"
            placeholder="Masukkan password baru"
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("new")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Konfirmasi Password Baru */}
        <div className="relative">
          <input
            type={showPassword.confirm ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 pt-3 focus:border-green-600 text-sm md:text-base"
            placeholder="Konfirmasi password baru"
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("confirm")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Tombol Simpan */}
      <button
        onClick={handleSave}
        className="mt-6 w-full bg-green-600 text-white font-bold py-3 px-6 md:px-12 rounded-lg hover:bg-green-700 text-sm md:text-base"
      >
        Ubah Password
      </button>
    </div>
  )
}
