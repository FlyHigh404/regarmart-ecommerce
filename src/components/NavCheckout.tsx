import Link from "next/link"

export default function CheckoutNavbar() {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center px-4 sm:px-8 h-24">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 flex-shrink-0">
          <img 
            src="/Logo.png" 
            alt="RegarMart Logo" 
            className="w-36 sm:w-48 h-12 sm:h-14 object-contain" 
          />
        </Link>

        <div className="hidden md:block h-12 w-px bg-gray-300 mx-4"></div>

        {/* Judul Checkout */}
        <div className="flex-1 justify-start md:justify-center">
          <h1 className="text-green-600 font-medium text-lg sm:text-xl">
            Checkout
          </h1>
        </div>
      </div>
    </nav>
  )
}
