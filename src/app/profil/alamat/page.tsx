"use client"
import { useState } from "react"
import { Search, MapPin, X } from "lucide-react"
import TambahAlamat from "@/components/TambahAlamat"
import InputBox from "@/components/InputBox"

type Alamat = {
  catatan?: string
  id: number
  label?: string
  nama: string
  telp: string
  alamat: string
  utama?: boolean
}

export default function ProfilAlamatPage() {
  const [search, setSearch] = useState("")
  const [openTambah, setOpenTambah] = useState(false)
  const [openEdit, setOpenEdit] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [alamatEdit, setAlamatEdit] = useState<Alamat | null>(null)
  const [tambahOpen, setTambahOpen] = useState(false)

  const [alamatList, setAlamatList] = useState<Alamat[]>([
    {
      id: 1,
      label: "Rumah",
      nama: "Team Genesis",
      telp: "0895360577489",
      alamat: "Jl. Merpati No.40ab, Kepuh, Betro, Sedati, Sidoarjo, Jawa Timur",
      utama: true,
      catatan: "",
    },
    {
      id: 2,
      label: "Kantor",
      nama: "Team Genesis",
      telp: "08123456789",
      alamat: "Jl. Sudirman No. 10, Jakarta Selatan",
      catatan: "",
    },
  ])

  const filtered = alamatList.filter((a) => a.alamat.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = (id: number) => {
    setAlamatList(alamatList.filter((a) => a.id !== id))
  }

  const handleSaveEdit = () => {
    if (alamatEdit) {
      setAlamatList((prev) => prev.map((a) => (a.id === alamatEdit.id ? alamatEdit : a)))
      setEditOpen(false)
    }
  }

  return (
    <div
      className="w-full max-w-[756.65px] rounded-[15px] bg-white p-4 md:p-8 font-jakarta"
      style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6 -mt-8 md:-mt-16">
        <h1 className="text-black font-bold text-xl md:text-2xl mt-6 md:mt-12">Alamat</h1>
      </div>

      {/* Search + Tambah */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-4 md:mb-6 gap-3 md:gap-0">
        <div className="relative w-full md:w-87">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari alamat..."
            className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#26A81D]"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
        <button
          className="px-4 py-2 rounded-xl w-full md:w-50 h-10 bg-green-500 text-white font-semibold hover:bg-green-700 text-sm md:text-base"
          onClick={() => setTambahOpen(true)}
        >
          + Tambah Alamat
        </button>
      </div>

      {/* List Alamat */}
      <div className="space-y-3 md:space-y-4">
        {alamatList.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`bg-white shadow rounded-xl p-3 md:p-4 cursor-pointer transition border ${
              selected === item.id ? "border-green-500 shadow-[0_0_16px_rgba(38,168,29,0.32)]" : "border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                <p className="font-medium text-[14px] md:text-[15px] font-jakarta text-[#8F8F8F]">{item.nama}</p>
                {item.utama && (
                  <span className="bg-green-100 text-green-600 text-xs font-medium px-2 md:px-2.5 py-0.5 rounded-full">
                    Utama
                  </span>
                )}
              </div>
            </div>

            <div className="pl-6 md:pl-8 mt-2">
              <p className="font-medium text-xs md:text-sm font-jakarta text-black">
                {item.nama}
                <span className="after:content-['|'] after:mx-2 text-[#8F8F8F]"></span>
                <span className="font-medium text-[13px] md:text-[14px] font-jakarta text-[#8F8F8F]">{item.telp}</span>
              </p>
              <p className="font-normal text-[12px] md:text-[13px] font-jakarta text-[#8F8F8F] leading-relaxed">
                {item.alamat}
              </p>

              <div className="flex gap-2 mt-2 text-xs md:text-sm">
                <button
                  className="text-green-600 hover:text-green-800 font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAlamatEdit(item)
                    setEditOpen(true)
                  }}
                >
                  Ubah
                </button>
                <span className="text-gray-400">|</span>
                <button
                  className="text-gray-500 hover:text-red-600 font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id)
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Alamat */}
      <TambahAlamat
        isOpen={tambahOpen}
        onClose={() => setTambahOpen(false)}
        onSave={(alamatBaru: Alamat) => setAlamatList([...alamatList, alamatBaru])}
      />

      {/* Modal Edit Alamat */}
      {editOpen && alamatEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-4 md:p-6 relative">
            <button
              className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setEditOpen(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-base md:text-lg font-bold text-black mb-3 md:mb-4 text-center pr-8">Ubah Alamat</h2>
            <hr className="border-gray-200 my-3" />

            <div className="space-y-3 md:space-y-4">
              <InputBox
                label="Label Alamat"
                value={alamatEdit.label || ""}
                onChange={(e) => setAlamatEdit({ ...alamatEdit, label: e.target.value })}
                placeholder="Contoh: Rumah, Kantor"
              />

              <InputBox
                label="Alamat Lengkap"
                value={alamatEdit.alamat}
                onChange={(e) => setAlamatEdit({ ...alamatEdit, alamat: e.target.value })}
                placeholder="Tulis alamat lengkap"
              />

              <InputBox
                label="Catatan untuk kurir (Opsional)"
                value={alamatEdit.catatan || ""}
                onChange={(e) => setAlamatEdit({ ...alamatEdit, catatan: e.target.value })}
                placeholder="Contoh: warna rumah, patokan masjid"
              />

              <InputBox
                label="Nama Penerima"
                value={alamatEdit.nama}
                onChange={(e) => setAlamatEdit({ ...alamatEdit, nama: e.target.value })}
                placeholder="Nama lengkap"
              />

              <InputBox
                label="No HP penerima"
                value={alamatEdit.telp}
                onChange={(e) => setAlamatEdit({ ...alamatEdit, telp: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="mt-4 md:mt-6 flex justify-center">
              <button
                className="w-full bg-green-600 text-white px-6 md:px-10 py-2.5 md:py-3 rounded-xl font-semibold hover:bg-green-700 text-sm md:text-base"
                onClick={handleSaveEdit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
