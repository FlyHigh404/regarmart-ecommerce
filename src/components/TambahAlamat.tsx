"use client"
import React, { useState } from "react"
import InputBox from "@/components/InputBox"
import { User, Smartphone, Home, MapPin, ClipboardList } from "lucide-react"

type Alamat = {
  id: number
  label?: string
  nama: string
  telp: string
  alamat: string
  catatan?: string
  utama?: boolean
}

interface TambahAlamatProps {
  id?: number
  isOpen: boolean
  onClose: () => void
  onSave: (alamat: Alamat) => void
}

const Checkbox = ({
  label,
  checked,
  onChange,
  children,
}: {
  label?: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  children?: React.ReactNode
}) => (
  <label className="flex items-start gap-2 cursor-pointer text-xs sm:text-sm">
    <input
      type="checkbox"
      className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 rounded border border-[#8F8F8F] bg-transparent focus:ring-green-500 text-green-600 mt-0.5"
      checked={checked}
      onChange={onChange}
    />
    <span className="flex-1 text-gray-700 font-normal leading-snug">
      {label}
      {children}
    </span>
  </label>
)

const TambahAlamat: React.FC<TambahAlamatProps> = ({ isOpen, onClose, onSave }) => {
  const [nama, setNama] = useState("")
  const [noHp, setNoHp] = useState("")
  const [labelAlamat, setLabelAlamat] = useState("")
  const [alamat, setAlamat] = useState("")
  const [catatan, setCatatan] = useState("")
  const [jadikanUtama, setJadikanUtama] = useState(false)
  const [setuju, setSetuju] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    if (!nama || !noHp || !alamat || !setuju) {
      alert("Harap isi semua kolom wajib dan setujui syarat & ketentuan.")
      return
    }

    const alamatBaru: Alamat = {
      id: Date.now(),
      nama,
      telp: noHp,
      alamat,
      label: labelAlamat || undefined,
      catatan: catatan || undefined,
      utama: jadikanUtama,
    }
    onSave(alamatBaru)
    setNama("")
    setNoHp("")
    setAlamat("")
    setLabelAlamat("")
    setCatatan("")
    setJadikanUtama(false)
    setSetuju(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 font-jakarta px-3 sm:px-0">
      <div
        className="
          bg-white 
          w-full sm:w-[650px] 
          max-h-[90vh] sm:max-h-[150vh] 
          rounded-xl sm:rounded-2xl 
          p-4 sm:p-6 
          relative overflow-hidden
        "
      >
        {/* Header */}
        <div className="relative flex items-center border-b border-gray-200 pb-2 sm:pb-3 mb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 text-center w-full">
            Tambah Alamat
          </h2>
          <button
            className="absolute right-0 text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3 sm:space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1 sm:pr-2">
          <p className="font-semibold text-gray-800 text-sm sm:text-base">Isi detail alamat</p>
          <InputBox
            label="Nama Penerima"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama penerima"
            icon={<User size={18} className="sm:w-5 sm:h-5 text-gray-400" />}
          />
          <InputBox
            label="No HP Penerima"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            placeholder="Masukkan nomor HP"
            icon={<Smartphone size={18} className="sm:w-5 sm:h-5 text-gray-400" />}
          />
          <InputBox
            label="Label Alamat"
            value={labelAlamat}
            onChange={(e) => setLabelAlamat(e.target.value)}
            placeholder="Contoh: Rumah, Kantor"
            icon={<Home size={18} className="sm:w-5 sm:h-5 text-gray-400" />}
          />
          <InputBox
            label="Alamat Lengkap"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            placeholder="Tulis alamat lengkap"
            icon={<MapPin size={18} className="sm:w-5 sm:h-5 text-gray-400" />}
          />
          <InputBox
            label="Catatan untuk Kurir (Opsional)"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Warna rumah, patokan, pesan khusus"
            icon={<ClipboardList size={18} className="sm:w-5 sm:h-5 text-gray-400" />}
          />

          {/* Checkbox */}
          <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
            <Checkbox
              label="Jadikan alamat utama"
              checked={jadikanUtama}
              onChange={(e) => setJadikanUtama(e.target.checked)}
            />
            <Checkbox
              checked={setuju}
              onChange={(e) => setSetuju(e.target.checked)}
            >
              <span className="text-xs sm:text-sm">
                Saya menyetujui{" "}
                <a href="#" className="text-green-600 font-semibold hover:underline">
                  Syarat & Ketentuan
                </a>{" "}
                serta{" "}
                <a href="#" className="text-green-600 font-semibold hover:underline">
                  Kebijakan Privasi
                </a>{" "}
                pengaturan alamat di Regar Mart
              </span>
            </Checkbox>
          </div>
        </div>

        {/* Button */}
        <div className="mt-4 sm:mt-6">
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base disabled:bg-gray-400"
            onClick={handleSave}
            disabled={!setuju}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

export default TambahAlamat
