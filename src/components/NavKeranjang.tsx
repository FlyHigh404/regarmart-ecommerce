import Link from "next/link"

const NavKeranjang = () => {
  return (
    <>
      <nav className="w-full h-24 pl-52 flex items-center px-8 shadow-sm bg-white border-b border-gray-200">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4">
          <img 
            src="/Logo.png" 
            alt="RegarMart Logo" 
            className="w-48 h-14 object-contain" 
          />
        </Link>

        {/* Vertical Divider */}
        <div className="h-12 w-px bg-gray-300 mx-8"></div>

        {/* Keranjang Belanja */}
        <div className="flex items-center">
          <h1 className="text-green-600 font-medium text-xl">
            Keranjang Belanja
          </h1>
        </div>
      </nav>
    </>
  )
}

export default NavKeranjang
