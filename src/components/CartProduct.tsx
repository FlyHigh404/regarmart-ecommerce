"use client";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface CartProductProps {
  product: Product;
  index: number;
}

const CartProduct: React.FC<CartProductProps> = ({ product, index }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const { incrementCart } = useCart();

  const handleAddToCart = async (product: Product) => {
    if (!session) {
      setErrorMessage("Anda harus login terlebih dahulu untuk menambahkan produk ke keranjang.");
      setShowErrorModal(true);
      return;
    }

    if (session.user?.role === "ADMIN") {
      setErrorMessage("Akun admin tidak dapat menambahkan produk ke keranjang.");
      setShowErrorModal(true);
      return;
    }

    setIsAddingToCart(true);

    try {
      const data = {
        productId: product.id,
        quantity: 1,
        unitPrice: product.price,
      };

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("Gagal menambahkan ke keranjang");
      }
      setTimeout(() => incrementCart(), 100);
    } catch (error: any) {
      console.error("Error terjadi:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowErrorModal(false);
    router.push("/auth/signin");
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  const formatPrice = (price: string | number) => {
    const numericPrice = Number(price);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };


  return (
    <>
      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Tidak Dapat Menambahkan
              </h3>
              <button
                onClick={closeErrorModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              {errorMessage}
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeErrorModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Tutup
              </button>
              {!session && (
                <button
                  onClick={handleLoginRedirect}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Link href={`/katalog/${product.id}`} passHref>
        <div
          key={product.id}
          className="cursor-pointer bg-white/90 backdrop-blur-sm 
               rounded-lg sm:rounded-xl 
               p-1.5 sm:p-3 lg:p-2 
               shadow-sm sm:shadow-md hover:shadow-xl 
               transition-all duration-500 hover:-translate-y-2 
               group animate-card-appear"
          style={{ animationDelay: `${900 + index * 200}ms` }}
        >
          {/* Gambar */}
          <div className="mb-2 sm:mb-4 bg-gray-50 rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
            <Image
              src={product.imageUrl[0] || "/placeholder.svg"}
              alt={product.name}
              width={400}
              height={250}
              className="w-full h-20 sm:h-28 lg:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Nama + Berat */}
          <h4 className="font-bold text-sm sm:text-base lg:text-sm text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-300">
            {product.name}{" "}
            <span className="font-normal text-gray-600 text-xs sm:text-sm">{product.weight}</span>
          </h4>

          {/* Stok */}
          <p className="text-gray-500 text-xs sm:text-sm lg:text-xs mb-1">
            Sisa stok: {product.stock}
          </p>

          {/* Deskripsi */}
          <p className="text-gray-600 text-[0.65rem] sm:text-xs lg:text-[0.7rem] mb-1 line-clamp-2">
            {product.description}
          </p>

          {/* Harga */}
          <span className="block text-sm sm:text-base lg:text-sm font-bold text-gray-800 mb-1.5">
            {formatPrice(product.price)}
          </span>

          {/* Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product);
            }}
            disabled={isAddingToCart || product.stock === 0}
            className={`
              w-full py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-[10px] 
              transition-all duration-300 flex items-center justify-center gap-1 
              transform active:scale-95
              ${isAddingToCart
                ? "bg-gray-400 cursor-not-allowed"
                : product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:scale-105"
              }
            `}
          >
            {isAddingToCart ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                <span className="ml-1">Menambahkan...</span>
              </>
            ) : product.stock === 0 ? (
              "Stok Habis"
            ) : (
              <>
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Tambah Keranjang
              </>
            )}
          </button>
        </div>
      </Link>
    </>
  );
};

export default CartProduct;
