"use client"
import { useState } from "react"
import { MapPin, X } from "lucide-react"
import InputBox from "@/components/InputBox"
import TambahAlamat from "@/components/TambahAlamat"

type Alamat = {
  id: number
  label?: string
  nama: string
  telp: string
  alamat: string
  catatan?: string
  utama?: boolean
}

interface DaftarAlamatProps {
  open: boolean
  setOpen: (val: boolean) => void
  onSelectAlamat?: (alamat: Alamat) => void
}

export default function DaftarAlamat({ open, setOpen, onSelectAlamat }: DaftarAlamatProps) {
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
      alamat:
        "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
      catatan: "Dekat Masjid, Warna cat rumah hijau",
      utama: true,
    },
    {
      id: 2,
      label: "Kantor",
      nama: "Team Genesis",
      telp: "0895360577489",
      alamat:
        "Jl. Merpati No.40ab, Kepuh, Betro, Kec. Sedati, Kabupaten Sidoarjo, Jawa Timur 61253, Indonesia",
    },
  ])

  if (!open) return null

  const handleDelete = (id: number) => {
    setAlamatList(alamatList.filter((a) => a.id !== id))
  }

  const handleSaveEdit = () => {
    if (alamatEdit) {
      setAlamatList((prev) =>
        prev.map((a) => (a.id === alamatEdit.id ? alamatEdit : a))
      )
      setEditOpen(false)
    }
  }

  return (
    <>
      {/* Modal Daftar Alamat */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-2xl shadow-lg w-[650px] max-h-[90vh] overflow-y-auto p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          <h2 className="text-lg font-bold font-jakarta text-black mb-4 text-center">
            Daftar Alamat
          </h2>

          <hr className="border-gray-200 my-3" />

          {/* Tambah Alamat */}
          <div className="w-full flex justify-center mb-4">
            <button
              className="px-4 py-2 rounded-xl w-full bg-green-100 text-green-600 font-semibold hover:bg-green-200"
              onClick={() => setTambahOpen(true)}
            >
              + Tambah Alamat
            </button>
          </div>

          {/* List Alamat */}
          <div className="space-y-4">
            {alamatList.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`bg-white shadow rounded-xl p-4 cursor-pointer transition border ${
                  selected === item.id
                    ? "border-green-500 shadow-[0_0_16px_rgba(38,168,29,0.32)]"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-green-600" />
                    <p className="font-medium text-[15px] font-jakarta text-[#8F8F8F]">
                      {item.nama}
                    </p>
                    {item.utama && (
                      <span className="bg-green-100 text-green-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Utama
                      </span>
                    )}
                  </div>
                </div>

                <div className="pl-8 mt-2">
                  <p className="font-medium text-sm font-jakarta text-black">
                    {item.nama}
                    <span className="after:content-['|'] after:mx-2 text-[#8F8F8F]"></span>
                    <span className="font-medium text-[14px] font-jakarta text-[#8F8F8F]">
                      {item.telp}
                    </span>
                  </p>
                  <p className="font-normal text-[13px] font-jakarta text-[#8F8F8F]">
                    {item.alamat}
                  </p>

                  <div className="flex gap-2 mt-2 text-sm">
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

          {/* Konfirmasi Pilih Alamat */}
          <div className="mt-6 flex justify-center">
            <button
              className="w-full bg-green-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-green-700"
              onClick={() => {
                const alamatTerpilih = alamatList.find((a) => a.id === selected)
                if (alamatTerpilih && onSelectAlamat) {
                  onSelectAlamat(alamatTerpilih)
                }
                setOpen(false)
              }}
            >
              Pilih alamat
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah Alamat */}
      <TambahAlamat
        isOpen={tambahOpen}
        onClose={() => setTambahOpen(false)}
        onSave={(alamatBaru: Alamat) =>
          setAlamatList([...alamatList, alamatBaru])
        }
      />

      {/* Modal Edit Alamat */}
      {editOpen && alamatEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setEditOpen(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-black mb-4 text-center">Ubah Alamat</h2>
            <hr className="border-gray-200 my-3" />

            <div className="space-y-4">
              <InputBox
                label="Label Alamat"
                value={alamatEdit.label || ""}
                onChange={(e) =>
                  setAlamatEdit({ ...alamatEdit, label: e.target.value })
                }
                placeholder="Contoh: Rumah, Kantor"
              />

              <InputBox
                label="Alamat Lengkap"
                value={alamatEdit.alamat}
                onChange={(e) =>
                  setAlamatEdit({ ...alamatEdit, alamat: e.target.value })
                }
                placeholder="Tulis alamat lengkap"
              />

              <InputBox
                label="Catatan untuk kurir (Opsional)"
                value={alamatEdit.catatan || ""}
                onChange={(e) =>
                  setAlamatEdit({ ...alamatEdit, catatan: e.target.value })
                }
                placeholder="Contoh: warna rumah, patokan masjid"
              />

              <InputBox
                label="Nama Penerima"
                value={alamatEdit.nama}
                onChange={(e) =>
                  setAlamatEdit({ ...alamatEdit, nama: e.target.value })
                }
                placeholder="Nama lengkap"
              />

              <InputBox
                label="No HP penerima"
                value={alamatEdit.telp}
                onChange={(e) =>
                  setAlamatEdit({ ...alamatEdit, telp: e.target.value })
                }
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="mt-6 flex justify-center">
              <button
                className="w-full bg-green-600 text-white px-10 py-3 rounded-xl font-semibold hover:bg-green-700"
                onClick={handleSaveEdit}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
