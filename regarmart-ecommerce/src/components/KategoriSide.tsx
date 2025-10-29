"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Star, SlidersHorizontal } from "lucide-react"

interface Category {
  id: string
  name: string
}

interface KategoriSideProps {
  categories: Category[]
  onSelectCategory: (categoryId: string) => void
}

export default function KategoriSide({
  categories,
  onSelectCategory,
}: KategoriSideProps) {
  const [openKategori, setOpenKategori] = useState(true)
  const [openHarga, setOpenHarga] = useState(true)
  const [openRating, setOpenRating] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
    onSelectCategory(categoryId)
  }

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) => (prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]))
  }

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
          {openKategori ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openKategori && (
          <ul className="mt-3 space-y-3 text-sm text-gray-700">
            {categories.map((cat) => (
              <li key={cat.id} className="cursor-pointer flex items-center justify-between transition-colors">
                <span>{cat.name}</span>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                  className="
                    w-5 h-5 
                    appearance-none
                    rounded-md
                    border border-black
                    cursor-pointer
                    transition-all
                    checked:bg-[#6EC568]
                    checked:border-[#6EC568]
                    relative
                    after:content-['✓']
                    after:absolute
                    after:text-white
                    after:text-sm
                    after:font-bold
                    after:top-[0px]
                    after:left-[4px]
                  "
                />
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
          {openHarga ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
          {openRating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openRating && (
          <div className="mt-3 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`rating-${rating}`}
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingToggle(rating)}
                  className="
                    w-5 h-5 
                    appearance-none
                    rounded-md
                    border border-black
                    cursor-pointer
                    transition-all
                    checked:bg-[#6EC568]
                    checked:border-[#6EC568]
                    relative
                    after:content-['✓']
                    after:absolute
                    after:text-white
                    after:text-sm
                    after:font-bold
                    after:top-[0px]
                    after:left-[4px]
                  "
                />
                <label htmlFor={`rating-${rating}`} className="flex items-center gap-1 text-sm cursor-pointer">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  {rating} ke atas
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-full transition-colors duration-300">
        Terapkan Filter
      </button>
    </div>
  )
}