import Image from "next/image"

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full py-8 md:py-16 px-4 md:px-6 relative"
      style={{
        backgroundImage: 'url("/bgabt_beranda.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/IconRM.png"
            alt="Regar Mart Logo"
            width={200}
            height={200}
            className="object-contain w-32 h-32 md:w-[200px] md:h-[200px]"
          />
        </div>

        {/* Teks Konten */}
        <div className="flex-1">
          <h1
            className="font-jakarta text-2xl md:text-[40px] font-bold text-green-600 text-center md:text-left"
            style={{
              color: "#16a34a",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.10)",
            }}
          >
            Tentang Regar Mart
          </h1>

          <p
            className="mt-4 md:mt-6 font-jakarta text-base md:text-[20px] font-light text-center md:text-left"
            style={{
              color: "black",
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.10)",
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </p>

          <p
            className="mt-3 md:mt-4 font-jakarta text-base md:text-[20px] font-extralight text-center md:text-left"
            style={{
              color: "black",
            }}
          >
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>
        </div>
      </div>
    </section>
  )
}
