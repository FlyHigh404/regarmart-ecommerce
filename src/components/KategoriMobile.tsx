"use client";
import { X, Star } from "lucide-react";
import { useState } from "react";

interface KategoriMobileProps {
  categories: { id: string; name: string }[];
  selectedCategories: string[];
  onClose: () => void;
  onChangeCategories: (selected: string[]) => void;
  onReset: () => void;
}

export default function KategoriMobile({
  categories,
  selectedCategories,
  onClose,
  onChangeCategories,
  onReset,
}: KategoriMobileProps) {
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Toggle kategori multi-select
  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      onChangeCategories(selectedCategories.filter((c) => c !== id));
    } else {
      onChangeCategories([...selectedCategories, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:hidden z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90%] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Filter</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3">Rating</h3>
          <div className="flex gap-3">
            {["4 ke atas", "3 ke atas"].map((label, idx) => {
              const value = idx === 0 ? "4" : "3";
              const active = selectedRating === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedRating(active ? null : value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    active
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Batas Harga */}
        <div className="mb-6">
          <h3 className="text-base font-medium mb-3">Batas Harga</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center border rounded-lg px-3 py-2">
              <span className="text-gray-400 mr-2">Rp</span>
              <input
                type="number"
                placeholder="Minimum"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full outline-none"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="flex-1 flex items-center border rounded-lg px-3 py-2">
              <span className="text-gray-400 mr-2">Rp</span>
              <input
                type="number"
                placeholder="Maksimal"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Kategori */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium">Kategori</h3>
            <button className="text-green-600 text-sm font-medium">
              Lihat Semua
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg border ${
                    active
                      ? "bg-green-50 border-green-500 text-green-600"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              onReset();
              setSelectedRating(null);
              setMinPrice("");
              setMaxPrice("");
              onClose();
            }}
            className="flex-1 py-3 rounded-xl border border-green-200 bg-green-50 text-green-600 font-medium"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-green-500 text-white font-medium"
          >
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
