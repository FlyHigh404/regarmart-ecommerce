"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import CardCategory from "@/components/CardCategory" // pastikan path benar

interface Category {
  title: string
  description: string
  image: string
  circleBgColor: string
}

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
  const categories: Category[] = [
    {
      title: "Buah Segar",
      description: "Buah segar tanpa pestisida, berasal dari petani unggulan",
      image: "/ktgbuah.png",
      circleBgColor: "/bg1.png",
    },
    {
      title: "Sayuran Segar",
      description: "Dapatkan berbagai sayuran hijau segar",
      image: "/ktgsayur.png",
      circleBgColor: "/bg2.png",
    },
    {
      title: "Frozen Food",
      description: "Berbagai pilihan Frozen food yang lezat",
      image: "/ktgfrozen.png",
      circleBgColor: "/bg3.png",
    },
    {
      title: "Sembako",
      description: "Dapatkan pilihan sembako yang lengkap",
      image: "/ktgsembako.png",
      circleBgColor: "/bg4.png",
    },
  ]

  const [animatedIndex, setAnimatedIndex] = useState(0)
  const [isReturning, setIsReturning] = useState(false)
  const idleTimer = useRef<NodeJS.Timeout | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    setIsReturning(false)
    idleTimer.current = setTimeout(() => {
      setIsReturning(true)
    }, 1500)
  }

  const handlePrev = () => {
    setAnimatedIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1))
    resetIdleTimer()
  }

  const handleNext = () => {
    setAnimatedIndex((prev) => (prev + 1) % categories.length)
    resetIdleTimer()
  }

  useEffect(() => {
    resetIdleTimer()
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [animatedIndex])

  // 🔹 Animasi masuk saat muncul di layar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="category"
      className={`relative py-16 overflow-hidden transition-all duration-700 
        ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/bgktg_beranda.png)" }}
      ></div>
      <div className="absolute inset-0"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-10 ml-4 md:ml-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
        {/* Title & desktop chevron */}
        <div className="flex flex-col md:justify-center w-full md:w-[280px] md:shrink-0 text-center md:text-left relative">
          <h2 className="text-white font-bold text-2xl md:text-3xl leading-tight mb-2">
            Pilihan produk kami
          </h2>
          <p className="text-white/90 text-base mb-6 md:mb-8">Kategori Produk</p>

          {/* Desktop chevron */}
          <div className="hidden md:flex gap-3 justify-center md:justify-start">
            <ChevronButton direction="left" onClick={handlePrev} size="md" />
            <ChevronButton direction="right" onClick={handleNext} size="md" />
          </div>
        </div>

        {/* Slider - Kartu */}
        <div className="w-full flex gap-4 overflow-x-auto no-scrollbar md:overflow-visible">
          {categories.map((cat, index) => (
            <CardCategory
              key={index}
              index={index}
              title={cat.title}
              description={cat.description}
              image={cat.image}
              circleBgColor={cat.circleBgColor}
              isActive={index === animatedIndex}
              isReturning={isReturning && index === animatedIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}