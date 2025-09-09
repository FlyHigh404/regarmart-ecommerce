"use client"
import { useState } from "react"
import type React from "react"

import Image from "next/image"
import { Pencil, ChevronDown } from "lucide-react"

const user = {
  name: "Team Genesis",
  phone: "0895360577489",
  email: "email@regarmart.com",
  birthdate: "isi tanggal lahirmu",
  gender: "Laki-laki",
}

export default function ProfilForm() {
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone,
    birthdate: user.birthdate,
    gender: user.gender,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    console.log("Data tersimpan:", formData)
  }

  return (
    <div className="w-full max-w-[756px] bg-white p-4 md:p-8 rounded-xl shadow">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Bagian Foto */}
        <div className="flex flex-col items-center w-full md:w-[200px]">
          <div className="w-[150px] h-[123px] md:w-[200px] md:h-[164px] rounded-xl overflow-hidden border border-gray-200">
            <Image
              src="/IconProfil.png"
              alt="Foto Profil"
              width={200}
              height={164}
              className="object-cover w-full h-full"
            />
          </div>

          <button className="mt-3 flex justify-center items-center w-[150px] md:w-[201px] h-[40px] rounded-lg bg-green-100 text-green-600 font-medium hover:bg-green-200 text-sm md:text-base">
            Pilih Foto
          </button>

          <p className="mt-2 text-xs text-gray-500 text-center">
            Ukuran gambar maks. 1MB <br />
            Format: .JPEG, .PNG
          </p>
        </div>

        {/* Bagian Form */}
        <div className="flex-1">
          {/* Input Nama */}
          <div className="relative mb-4">
            <label htmlFor="name" className="text-sm text-gray-500 absolute top-2 left-3">
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 pt-6 focus:border-green-600 text-sm md:text-base"
            />
            <Pencil size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Input Nomor HP */}
          <div className="relative mb-4">
            <label htmlFor="phone" className="text-sm text-gray-500 absolute top-2 left-3">
              Nomor HP
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 pt-6 focus:border-green-600 text-sm md:text-base"
            />
            <Pencil size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Input Tanggal Lahir */}
          <div className="relative mb-4">
            <label htmlFor="birthdate" className="text-sm text-gray-500 absolute top-2 left-3">
              Tanggal Lahir
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 pt-6 focus:border-green-600 text-sm md:text-base"
            />
          </div>

          {/* Input Jenis Kelamin */}
          <div className="relative w-full">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:border-green-600 appearance-none text-sm md:text-base"
            >
              <option value="">Pilih jenis kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Tombol Simpan*/}
      <button
        onClick={handleSave}
        className="mt-4 md:mt-6 w-full bg-green-600 text-white font-bold py-3 px-6 md:px-12 rounded-lg hover:bg-green-700 text-sm md:text-base"
      >
        Simpan
      </button>
    </div>
  )
}
