"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Star,
  SlidersHorizontal,
} from "lucide-react";

export default function KategoriSide({ onSelectCategory }: { onSelectCategory: (category: string) => void }) {
  const [openKategori, setOpenKategori] = useState(true);
  const [openHarga, setOpenHarga] = useState(true);
  const [openRating, setOpenRating] = useState(true);

  const categories = ["Sembako", "Kebutuhan Rumah Tangga", "Sayuran"];

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Filter Kategori */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => setOpenKategori(!openKategori)}
          className="flex items-center justify-between w-full font-medium text-gray-700"
        >
          <span className="flex items-center gap-4">
            <SlidersHorizontal className="w-4 h-4" />
            Filter Kategori
          </span>
          {openKategori ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {openKategori && (
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="cursor-pointer hover:text-green-600 flex items-center justify-between transition-colors"
              >
                <span>{cat}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Batas Harga */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => setOpenHarga(!openHarga)}
          className="flex items-center justify-between w-full font-medium text-gray-700"
        >
          <span>Batas Harga</span>
          {openHarga ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {openHarga && (
          <div className="mt-3 space-y-2">
            <input
              type="number"
              placeholder="Rp Minimum"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Rp Maksimal"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => setOpenRating(!openRating)}
          className="flex items-center justify-between w-full font-medium text-gray-700"
        >
          <span>Rating</span>
          {openRating ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {openRating && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" id="rating4" className="w-4 h-4" />
            <label htmlFor="rating4" className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              4 ke atas
            </label>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300">
        Apply Filter
      </button>
    </div>
  );
}
