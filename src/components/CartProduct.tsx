import { Plus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Product } from "@/types";


interface CartProductProps {
    product: Product;
    index: number;
}

const CartProduct: React.FC<CartProductProps> = ({ product, index }) => {
    return (
        <div
            key={product.id}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 lg:p-2 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group animate-card-appear"
            style={{ animationDelay: `${900 + index * 200}ms` }}
        >
            {/* 1. Gambar */}
            <div className="mb-4 bg-gray-50 rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105">
                <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={250}
                    className="w-full h-28 lg:h-24 object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* 2. Nama + Berat */}
            <h4 className="font-bold text-base sm:text-lg lg:text-sm text-gray-800 mb-1 group-hover:text-green-600 transition-colors duration-300">
                {product.name}{" "}
                <span className="font-normal text-gray-600">{product.weight}</span>
            </h4>

            {/* 3. Stok */}
            <p className="text-gray-500 text-sm lg:text-xs mb-1">
                Sisa stok: {product.stock}
            </p>

            {/* 4. Deskripsi */}
            <p className="text-gray-600 text-xs sm:text-sm lg:text-[0.7rem] mb-1">
                {product.description}
            </p>

            {/* 5. Harga */}
            <span className="block text-base sm:text-xl lg:text-sm font-bold text-gray-800 mb-1.5">
                {product.price}
            </span>

            {/* 6. Button */}
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 lg:px-2.5 lg:py-2 rounded-lg font-small text-xs lg:text-[10px] transition-all duration-300 flex items-center justify-center gap-0.5 hover:shadow-lg transform hover:scale-105 active:scale-95">
                <Plus className="w-4 h-4 lg:w-4 lg:h-4" />
                Tambah ke Keranjang
            </button>
        </div>
    );
};

export default CartProduct;
