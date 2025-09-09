"use client"
import Link from "next/link"

export default function ProfilPage() {
  const user = {
    name: "Team Genesis",
    phone: "0895360577489",
    email: "email@regarmart.com",
    birthdate: "isi tanggal lahirmu",
    gender: "Laki-laki",
  }

  return (
    <div
      className="w-full md:w-[756.65px] rounded-[15px] bg-white p-4 md:p-8"
      style={{ boxShadow: "6px 6px 54px 0 rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 -mt-8 md:-mt-16">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-4">
          <img
            src="/icon.png"
            alt="Profile"
            className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md"
          />
          <h1 className="text-[#26A81D] font-bold text-xl md:text-2xl">Profil</h1>
        </div>
        <Link href="/profil/editprofil" className="mt-2 md:mt-0">
          <button className="w-full md:w-auto text-[#26A81D] font-bold text-base hover:underline px-4 py-2 md:p-0 border md:border-0 border-[#26A81D] rounded-lg md:rounded-none">
            Edit
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-0 md:gap-x-12">
        <div>
          <p className="text-[#8F8F8F] text-[15px] font-medium mb-1">Nama</p>
          <p className="text-[#1B1F1B] text-[15px] font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-[#8F8F8F] text-[15px] font-medium mb-1">Nomor HP</p>
          <p className="text-[#1B1F1B] text-[15px] font-medium">{user.phone}</p>
        </div>
        <div>
          <p className="text-[#8F8F8F] text-[15px] font-medium mb-1">Email</p>
          <p className="text-[#1B1F1B] text-[15px] font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-[#8F8F8F] text-[15px] font-medium mb-1">Tanggal lahir</p>
          <p className="text-[#1B1F1B] text-[15px] font-medium">{user.birthdate}</p>
        </div>
        <div>
          <p className="text-[#8F8F8F] text-[15px] font-medium mb-1">Jenis kelamin</p>
          <p className="text-[#1B1F1B] text-[15px] font-medium">{user.gender}</p>
        </div>
      </div>
    </div>
  )
}
