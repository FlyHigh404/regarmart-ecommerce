"use client"
import { Star } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import FormRating from "./FormRating"

interface RatingSectionProps {
  averageRating: number
  totalReviews: number
  ratings: { star: number; count: number }[]
  product: {
    id: string
    name: string
    image: string
    qty: number
    price: number
  }
  orderNumber: string
}

const RatingSection: React.FC<RatingSectionProps> = ({
  averageRating,
  totalReviews,
  ratings,
  product,
  orderNumber,
}) => {
  const { data: session } = useSession()
  const [isRatingOpen, setIsRatingOpen] = useState(false)

  const getPercentage = (count: number) => (count / totalReviews) * 100

  const sortedRatings = [...ratings].sort((a, b) => b.star - a.star)
  const leftRatings = sortedRatings.slice(0, 3)
  const rightRatings = sortedRatings.slice(3)

  const renderBar = (item: { star: number; count: number }) => {
    const hasReviews = totalReviews > 0
    const barColor = hasReviews ? "#26A81D" : "#d9d9d9"
    const percentage = hasReviews ? getPercentage(item.count) : 0

    return (
      <div key={item.star} className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-1 min-w-[30px]">
          <Star className="w-4 h-4 fill-[#26A81D] text-[#26A81D]" />
          <span className="text-xs font-medium text-gray-700">{item.star}</span>
        </div>
        <div className="flex-1 h-[6px] rounded-full bg-[#E5E5E5] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
            }}
          ></div>
        </div>
      </div>
    )
  }

  const handleWriteReview = () => {
    if (!session) {
      alert("Silakan login terlebih dahulu untuk menulis ulasan")
      return
    }

    if (session.user?.role === "ADMIN") {
      alert("Akun admin tidak dapat memberikan ulasan")
      return
    }

    setIsRatingOpen(true)
  }

  const isUserLoggedIn = session && session.user?.role !== "ADMIN"

  return (
    <div className="bg-white rounded-xl shadow-[6px_6px_54px_0_rgba(0,0,0,0.05)] p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">Rating pembeli</h2>
        <button
          className={`${
            isUserLoggedIn ? "bg-[#26A81D] hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          } text-white font-semibold text-[14px] tracking-[0.56px] rounded-md w-[140px] h-[38px] flex items-center justify-center transition-colors`}
          onClick={handleWriteReview}
          disabled={!isUserLoggedIn}
        >
          Tulis ulasan
        </button>
      </div>

      <div className="flex gap-8">
        <div className="flex items-start gap-4 pb-6">
          <Star className="w-[36px] h-[36px] fill-[#26A81D] text-[#26A81D] flex-shrink-0 mt-1" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-jakarta text-[40px] font-bold text-black leading-none">
                {averageRating.toFixed(1).replace(".", ",")}
              </span>
              <span className="text-gray-500 text-lg">/5</span>
            </div>
            <span className="text-gray-500 text-sm mt-[2px]">{totalReviews.toLocaleString()} ulasan</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="space-y-2">{sortedRatings.slice(0, 3).map(renderBar)}</div>
            <div className="space-y-2">{sortedRatings.slice(3).map(renderBar)}</div>
          </div>
        </div>
      </div>

      {/* FormRating Modal */}
      <FormRating
        open={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        product={product}
        orderNumber={orderNumber}
      />
    </div>
  )
}

export default RatingSection