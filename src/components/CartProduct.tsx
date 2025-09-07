"use client"
import { Plus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Product } from "@/types/product";
import Link from "next/link"; 

interface CartProductProps {
  product: Product;
  index: number;
}

const CartProduct: React.FC<CartProductProps> = ({ product, index }) => {
  return (
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
          {product.price}
        </span>

        {/* Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log("Tambah ke keranjang:", product.id);
          }}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-[10px] transition-all duration-300 flex items-center justify-center gap-1 hover:shadow-lg transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Tambah
        </button>
      </div>
    </Link>
  );
};

export default CartProduct;
