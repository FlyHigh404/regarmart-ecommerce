"use client"

import CardTesti from "@/components/CardTesti"

const testimonials = [
  { name: "Saefudin", role: "Mahasiswa", testimonial: "Lorem ipsum dolor sit amet...", avatar: "/profile-photo-saefudin.jpeg" },
  { name: "Darmaji", role: "Penjual Kurma", testimonial: "Lorem ipsum dolor sit amet...", avatar: "/profile-photo-darmaji.jpeg" },
  { name: "Michele Patrius", role: "Ibu Rumah Tangga", testimonial: "Lorem ipsum dolor sit amet...", avatar: "/profile-photo-michele.jpeg" },
  { name: "Ahmad", role: "Petani", testimonial: "Lorem ipsum dolor sit amet...", avatar: "/profile-photo-saefudin.jpeg" },
  { name: "Siti", role: "Pedagang", testimonial: "Lorem ipsum dolor sit amet...", avatar: "/profile-photo-michele.jpeg" },
  { name: "Budi", role: "Karyawan", testimonial: "Lorem ipsum dolor sit amet...", avatar: "/profile-photo-darmaji.jpeg" },
  { name: "Rina", role: "Guru", testimonial: "Lorem ipsum dolor sit amet...", avatar: "/profile-photo-michele.jpeg" },
]

export default function TestiSection() {
  return (
    <section
      id="testimoni"
      className="w-full py-16 px-6 font-jakarta relative overflow-hidden bg-gradient-to-b from-green-50/30 to-white"
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

        {/* Baris kedua (kanan → kiri) */}
        <div className="overflow-hidden">
          <div className="marquee-right flex gap-3 sm:gap-4">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`row2-${i}`}
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