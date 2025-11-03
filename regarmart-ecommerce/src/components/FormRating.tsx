"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { OrderProduct } from "@/types/order";

interface FormRatingProps {
  open: boolean;
  onClose: () => void;
  product: OrderProduct;
  orderNumber: string;
}

const FormRating: React.FC<FormRatingProps> = ({
  open,
  onClose,
  product,
  orderNumber,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Pilih rating terlebih dahulu!");
      return;
    }

    if (!review.trim()) {
      setError("Tulis ulasan terlebih dahulu!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Kirim rating ke endpoint rating
      const ratingResponse = await fetch(`/api/products/${product.id}/ratings`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include", // penting untuk session
        body: JSON.stringify({
          value: rating,
        }),
      });

      if (!ratingResponse.ok) {
        const errorData = await ratingResponse.json();
        throw new Error(errorData.error || "Gagal mengirim rating");
      }

      const reviewResponse = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          content: review, 
        }),
      });

      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json();
        throw new Error(errorData.error || "Gagal mengirim ulasan");
      }

      setRating(0);
      setReview("");
      onClose();
      alert("Rating dan ulasan berhasil dikirim!");
      
    } catch (err: any) {
      console.error("Error submitting review:", err);
      
      // Handle error spesifik
      if (err.message.includes("Unauthorized")) {
        setError("Anda harus login sebagai customer untuk memberikan ulasan");
      } else if (err.message.includes("Content required")) {
        setError("Ulasan tidak boleh kosong");
      } else if (err.message.includes("Rating must be 1-5")) {
        setError("Rating harus antara 1-5");
      } else {
        setError(err.message || "Terjadi kesalahan saat mengirim ulasan");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-jakarta p-4">
      <div
        className="relative flex flex-col p-6 w-full max-w-[564px] scale-90 sm:scale-100"
        style={{
          height: "380px",
          borderRadius: "10px",
          background: "#F8F8FA",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="w-6 h-6"></div>
          <h2 className="text-2xl font-bold text-black">Nilai Produk</h2>
          <button onClick={handleClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Produk */}
        <div className="flex items-center gap-3 py-4 border-b-2 border-gray-200">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={50}
            height={50}
            className="h-[50px] w-[50px] rounded-md object-cover"
          />
          <div>
            <p className="text-[14px] font-medium text-black">{product.name}</p>
            <p className="text-[12px] text-gray-500">Qty: x{product.qty}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Rating */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-6 w-full justify-between">
            <span className="text-[14px] text-gray-600">Kurang Baik</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => {
                    setRating(star);
                    setError(""); 
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={
                    star <= rating
                      ? "url(#gradStar)" 
                      : "#D1D5DB" 
                  }
                  className="w-8 h-8 cursor-pointer transition-transform hover:scale-110"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.918 1.48 8.229L12 18.896l-7.416 4.557 1.48-8.229L0 9.306l8.332-1.151z" />
                  <defs>
                    <linearGradient
                      id="gradStar"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="13.92%" stopColor="#6EC568" />
                      <stop offset="87.84%" stopColor="#26A81D" />
                    </linearGradient>
                  </defs>
                </svg>
              ))}
            </div>
            <span className="text-[14px] text-green-600">Sangat Baik</span>
          </div>
        </div>

        {/* Textarea */}
        <div className="mt-4 flex flex-col items-center">
          <div
            className="relative w-full max-w-[514px]"
          >
            <textarea
              placeholder="Isi ulasan.."
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setError(""); // Clear error ketika user mengetik
              }}
              maxLength={500}
              className="w-full h-[58px] rounded-lg border border-gray-300 pl-3 pr-10 py-3 text-[14px] resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {/* Icon pena */}
            <Image
              src="/edit-2.png"
              alt="Icon edit"
              width={22}
              height={22}
              className="absolute right-3 bottom-3 opacity-60"
            />
          </div>

          <div className="mt-1 w-full max-w-[514px] text-right text-[12px] text-gray-400">
            {review.length}/500
          </div>
        </div>

        {/* Button */}
        <div className="mt-4 flex justify-between gap-4">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex justify-center items-center rounded-md font-semibold text-green-700 bg-green-100
                       hover:bg-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                       flex-1 h-[45px]"
          >
            Nanti Saja
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex justify-center items-center rounded-md font-semibold text-white bg-green-600
                      hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                      flex-1 h-[45px]"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormRating;