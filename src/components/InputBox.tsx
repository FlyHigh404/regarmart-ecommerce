"use client"
import React from "react";

interface InputBoxProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode; 
}


const InputBox: React.FC<InputBoxProps> = ({ label, value, onChange, placeholder, icon }) => {
  return (
    <div
      className="w-full rounded-xl border border-gray-300 p-3 relative
                 hover:border-green-500 hover:shadow-sm
                 focus-within:border-green-500 focus-within:shadow-md focus-within:shadow-green-200
                 transition"
    >
      <div className="text-sm font-medium text-green-600 mb-1">{label}</div>
      {icon && (
        <div className="absolute top-1/2 -translate-y-1/2 right-3">
          {icon}
        </div>
      )}
      <input
        type="text"
        className="w-full border-0 focus:ring-0 p-0 text-black placeholder-gray-400 outline-none pr-8" // Tambahkan padding kanan (pr-8) untuk memberi ruang ikon
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputBox;