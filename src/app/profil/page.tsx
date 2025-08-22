"use client"
import Link from 'next/link';
import ProfilNavbar from '@/components/NavProfil';
import Sidebar from '@/components/ProfilSide';
import { CircleChevronLeft  } from 'lucide-react';
import React from 'react';

export default function ProfilPage() {
  const user = {
    name: 'Team Genesis',
    phone: '0895360577489',
    email: 'email@regarmart.com',
    birthdate: 'isi tanggal lahirmu',
    gender: '-',
  };

  return (
    <div className="w-[1440px] h-[1594px] mx-auto p-10 font-jakarta bg-gray-100">
      {/* Navbar profil */}
      <ProfilNavbar />

      <div className="mt-18">
        {/* Tombol kembali */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/">
            <div className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors">
              <CircleChevronLeft size={24} />
              <span className="text-lg font-medium">Kembali</span>
            </div>
          </Link>
        </div>

        {/* Sidebar dan Main Content Area */}
        <div className="flex gap-8">
          <Sidebar />

          <div 
            className="w-[756.65px] h-[354.03px] flex-shrink-0 rounded-[15px] bg-white p-8"
            style={{ boxShadow: '6px 6px 54px 0 rgba(0, 0, 0, 0.05)' }}
        >
            {/* Foto Profil */}
            <div className="flex -mt-16 mb-4">
              <img src="/icon.png" alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
            </div>

            {/* Profile Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-[#26A81D] font-bold text-2xl">Profil</h1>
              <button className="text-[#26A81D] font-bold text-base hover:underline">Edit</button>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-12">
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
        </div>
      </div>
    </div>
  );
}