"use client"

import { useEffect, useRef, useState } from "react"
import CardTesti from "@/components/CardTesti"

  const testimonials = [
  { name: "Chaidar Abdillah", role: "Mahasiswa", testimonial: "Sayurannya selalu segar dan harganya pas di kantong. Cocok banget buat anak kos yang pengin tetap makan sehat", avatar: "/Chaidar.jpg" },
  { name: "Setia Cahya", role: "Mahasiswa", testimonial: "Produk fresh dan pelayanannya cepat. Bikin belanja mingguan jadi lebih mudah dan nyaman", avatar: "/Setia.jpg" },
  { name: "Sharon Virginia", role: "Mahasiswa", testimonial: "Belanja di Regar Mart praktis dan lengkap. Nggak perlu repot ke pasar!", avatar: "/Sharon.jpg" },
  { name: "Abednego Sinaga", role: "Karyawan", testimonial: "Regar Mart bantu banget buat stok dapur. Harga terjangkau, sayur tahan lama, dan kualitasnya bagus.", avatar: "/Abednego.jpg" },
  { name: "Steven Silitonga", role: "Karyawan", testimonial: "Setiap belanja di sini selalu puas. Produknya segar, pelayanan cepat, dan bikin urusan dapur lebih simpel", avatar: "/Steven.jpg" },
  { name: "Ahmad Saddam", role: "Karyawan", testimonial: "Habis kerja tinggal pesan di Regar Mart. Sayur segar, lengkap, dan cepat sampai!", avatar: "/Ahmad.jpg" },
]

export default function TestiSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

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
      id="testimoni"
      className={`w-full py-16 px-6 font-jakarta relative overflow-hidden bg-gradient-to-b from-green-50/30 to-white 
        transition-all duration-700 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
      style={{
        backgroundImage: 'url("/bgtesti_beranda.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h3 className="text-green-600 font-semibold text-base sm:text-lg mb-2">
            Testimoni
          </h3>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-balance">
            Apa Yang Pengguna Katakan Tentang Kami
          </h2>
        </div>

        {/* Baris pertama (kiri → kanan) */}
        <div className="overflow-hidden mb-4 sm:mb-6">
          <div className="marquee-left flex gap-3 sm:gap-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`row1-${i}`}
                className="flex-shrink-0 transition-transform duration-500 hover:scale-105"
              >
                <CardTesti {...t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}