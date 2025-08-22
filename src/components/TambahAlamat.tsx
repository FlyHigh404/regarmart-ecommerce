"use client"
import React, { useState } from "react"
import InputBox from "@/components/InputBox"

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
  isOpen: boolean
  onClose: () => void
  onSave: (alamat: Alamat) => void
}

const TambahAlamat: React.FC<TambahAlamatProps> = ({ isOpen, onClose, onSave }) => {
  const [nama, setNama] = useState("")
  const [noHp, setNoHp] = useState("")
  const [labelAlamat, setLabelAlamat] = useState("")
  const [alamat, setAlamat] = useState("")
  const [catatan, setCatatan] = useState("")

  if (!isOpen) return null

  const handleSave = () => {
    const alamatBaru: Alamat = {
      id: Date.now(),
      nama,
      telp: noHp,
      alamat,
      label: labelAlamat,
      catatan,
    }
    onSave(alamatBaru)
    setNama("")
    setNoHp("")
    setAlamat("")
    setLabelAlamat("")
    setCatatan("")
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Tambah Alamat</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <InputBox
            label="Nama Penerima"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan nama penerima"
          />
          <InputBox
            label="No HP Penerima"
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            placeholder="Masukkan nomor HP"
          />
          <InputBox
            label="Label Alamat"
            value={labelAlamat}
            onChange={(e) => setLabelAlamat(e.target.value)}
            placeholder="Contoh: Rumah, Kantor"
          />
          <InputBox
            label="Alamat Lengkap"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            placeholder="Tulis alamat lengkap"
          />
          <InputBox
            label="Catatan untuk Kurir (Opsional)"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Warna rumah, patokan, pesan khusus"
          />
        </div>

        <div className="mt-6">
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

export default TambahAlamat
