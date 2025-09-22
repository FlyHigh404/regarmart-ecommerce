"use client"

import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CardCategory from "@/components/CardCategory"

interface ChevronButtonProps {
  direction: "left" | "right"
  onClick: () => void
  size?: "md" | "sm"
  className?: string
}

function ChevronButton({ direction, onClick, size = "md", className }: ChevronButtonProps) {
  const isLeft = direction === "left"
  const Icon = isLeft ? ChevronLeft : ChevronRight
  const baseSize = size === "md" ? 48 : 40
  const iconSize = size === "md" ? 24 : 20

  return (
    <button
      onClick={onClick}
      className={`group rounded-full bg-white flex items-center justify-center shadow-lg 
                  hover:bg-green-600 active:bg-green-700 
                  transition-colors duration-200 ${className}`}
      style={{ width: baseSize, height: baseSize }}
    >
      <Icon
        size={iconSize}
        className="text-green-600 group-hover:text-white group-active:text-white transition-colors duration-200"
      />
    </button>
  )
}

export default function CategorySection() {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 4,
      spacing: 16,
    },
    loop: true,
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 2, spacing: 12 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 2.5, spacing: 14 },
      },
    },
  })

  const categories = [
    {
      title: "Buah Segar",
      description: "Buah segar tanpa peptisida, berasal dari petani unggulan",
      image: "/susu.png",
    },
    {
      title: "Sayuran Segar",
      description: "Dapatkan berbagai sayuran hijau segar",
      image: "/wortel.png",
    },
    {
      title: "Frozen Food",
      description: "Berbagai pilihan Frozen food yang lezat",
      image: "/susu.png",
    },
    {
      title: "Sembako",
      description: "Dapatkan pilihan sembako yang lengkap",
      image: "/wortel.png",
    },
  ]

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/bgktg_beranda.png)" }}
      ></div>
      <div className="absolute inset-0 "></div>

      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 border border-white rounded-full opacity-20"></div>
        <div className="absolute top-20 right-1/4 w-20 h-20 border border-white rounded-full opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
        {/* Title & desktop chevron */}
        <div className="flex flex-col md:justify-center w-full md:w-[280px] md:shrink-0 text-center md:text-left relative">
          <h2 className="text-white font-bold text-2xl md:text-3xl leading-tight mb-2">
            Pilihan produk kami
          </h2>
          <p className="text-white/90 text-base mb-6 md:mb-8">Kategori Produk</p>

          {/* Desktop chevron */}
          <div className="hidden md:flex gap-3 justify-center md:justify-start">
            <ChevronButton direction="left" onClick={() => slider.current?.prev()} size="md" />
            <ChevronButton direction="right" onClick={() => slider.current?.next()} size="md" />
          </div>
        </div>

        {/* Slider */}
        <div ref={sliderRef} className="keen-slider w-full relative">
          {categories.map((cat, i) => (
            <div key={i} className="keen-slider__slide px-2">
              <CardCategory title={cat.title} description={cat.description} image={cat.image} />
            </div>
          ))}

          {/* Mobile chevron */}
          <div className="md:hidden absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 z-20 pointer-events-none">
            <ChevronButton
              direction="left"
              onClick={() => slider.current?.prev()}
              size="sm"
              className="pointer-events-auto"
            />
            <ChevronButton
              direction="right"
              onClick={() => slider.current?.next()}
              size="sm"
              className="pointer-events-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}