"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`bg-white py-12 px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Left Side - Brand and Description */}
          <div className="space-y-6 lg:ml-14">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <img
                src="/Logo.png"
                alt="RegarMart Logo"
                className="w-48 h-14 object-contain"
              />
            </div>

            {/* Description */}
            <div className="text-gray-500 font-book text-sm space-y-2 max-w-lg">
              <p className="leading-relaxed">
                Menyediakan kebutuhan sehari-hari seperti sembako, sayur, dan
              </p>
              <p className="leading-relaxed">
                perlengkapan rumah tangga, dengan layanan cepat,
              </p>
              <p className="leading-relaxed">
                pembayaran mudah, dan pengiriman langsung ke rumah Anda.
              </p>
            </div>
          </div>

          {/* Right Side - Contact Information */}
          <div className="space-y-6 lg:ml-96 lg:mt-3">
            <h3 className="text-xl font-semibold text-green-600 mb-6">
              Contact Us
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <p className="text-gray-500 text-sm font-book">
                  regarm4rt@gmail.com
                </p>
              </div>

              {/* FB */}
              <div className="flex items-center space-x-3">
                <Facebook className="w-5 h-5 text-gray-500" />
                <p className="text-gray-500 text-sm font-book">
                  Regar Mart
                </p>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm font-book">
                    Jl. Rungkut Asri No.72
                  </p>
                  <p className="text-gray-500 text-sm font-book">
                    Surabaya, 33169
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div
          style={{ borderTop: "1px solid rgba(88, 222, 43, 0.72)" }}
          className="my-8"
        ></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500 font-book">
              Copyright © 2025 Genesis Team Design.
            </p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-6 text-gray-500 text-xs sm:text-sm font-book">
            <span>All Rights Reserved |</span>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
            >
              Terms and Conditions
            </a>
            <span>|</span>
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;