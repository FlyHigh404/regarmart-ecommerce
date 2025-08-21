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
  return (
    <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8">
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

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white hover:bg-green-500 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right Side - Contact Information */}
          <div className="space-y-6 lg:ml-96 lg:mt-3">
            <h3 className="text-xl font-medium text-green-600 mb-6">
              Contacts us
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <p className="text-gray-500 text-sm font-book">
                  RegarMart@gmail.com
                </p>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <p className="text-gray-500 text-sm font-book">
                  +62 895-3605-77408
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
              <Link
                href="/admin-login"
                className=" text-sm font-book bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Admin Login
              </Link>
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
