"use client"
import React, { useState, useRef, useEffect, useCallback } from "react"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface NotificationItemData {
  id: string
  message: string
  createdAt: Date
  orderNumber: string
  productName: string
  imageUrl: string
  status: string
}

interface NotifItemProps extends NotificationItemData {
  index: number
}

const formatDateTime = (date: Date) => {
  const optionsDate: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" }
  const optionsTime: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false }
  const dateString = date.toLocaleDateString("id-ID", optionsDate).replace(/\//g, "-")
  const timeString = date.toLocaleTimeString("id-ID", optionsTime)
  return { dateString, timeString }
}

const NotifikasiItem: React.FC<NotifItemProps> = ({
  createdAt,
  orderNumber,
  productName,
  imageUrl,
  status,
  index,
}) => {
  const { dateString, timeString } = formatDateTime(new Date(createdAt))
  const isGreenBackground = index % 2 !== 0
  const rowClass = isGreenBackground ? "bg-white" : "bg-green-50"

  return (
    <div className={`flex p-2.5 border-b border-gray-200 cursor-pointer ${rowClass}`}>
      <div className="w-8 h-8 mr-3 flex-shrink-0 mt-0.5">
        <img src={imageUrl} alt={productName} className="w-full h-full object-cover rounded-md" />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <p className="font-semibold text-sm text-gray-800 truncate pr-2">{status}</p>
          <span className="text-[10px] text-gray-500 flex-shrink-0 mt-0.5">
            {dateString} | {timeString}
          </span>
        </div>
        <p className="text-xs text-gray-600 leading-snug">
          Periksa kelengkapan untuk pesanan <strong>#{orderNumber}</strong>. Puas dengan pesananmu? Jangan lupa
          untuk memberikan penilaian produk kami.
        </p>
      </div>
    </div>
  )
}

const NotifikasiCust: React.FC = () => {
  const router = useRouter()
  const [isClickedOpen, setIsClickedOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItemData[]>([])
  const componentRef = useRef<HTMLDivElement>(null)
  const isDropdownVisible = isClickedOpen || isHovered

  // 🧠 Ambil data notifikasi awal dari API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notification")
        const data = await res.json()
        setNotifications(data)
      } catch (err) {
        console.error("❌ Gagal ambil notifikasi awal:", err)
      }
    }
    fetchNotifications()
  }, [])

  // 🔔 Dengarkan notifikasi baru dari WebSocket
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent
      const notifData = customEvent.detail

      const newNotif: NotificationItemData = {
        id: String(Date.now()),
        message: `Status pesanan ${notifData.status}`,
        createdAt: new Date(),
        orderNumber: notifData.orderId || "INV-XXXX",
        productName: notifData.productName || "Produk Tidak Diketahui",
        imageUrl: notifData.imageUrl || "/default.jpg",
        status: notifData.status,
      }

      setNotifications((prev) => [newNotif, ...prev])
    }

    window.addEventListener("new-notification", handler)
    return () => {
      window.removeEventListener("new-notification", handler)
    }
  }, [])

  const handleMarkAllRead = useCallback(() => {
    setNotifications([])
    setIsClickedOpen(false)
    setIsHovered(false)
  }, [])

  // 🔢 Selalu tampilkan badge angka (meskipun 0)
  const badgeContent = notifications.length > 9 ? "9+" : notifications.length.toString()

  return (
    <div
      className="relative"
      ref={componentRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isClickedOpen) setIsHovered(false)
      }}
    >
      {/* Tombol Bell */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsClickedOpen((prev) => !prev)
        }}
        className={`relative p-2 rounded-lg transition ${
          isClickedOpen || isHovered ? "bg-green-100" : "hover:bg-green-100"
        }`}
      >
        <Bell
          className={`w-5 h-5 text-[#4BBF42] cursor-pointer transition-transform duration-200 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        {/* ✅ Selalu tampilkan badge, walau 0 */}
        <span
          className={`absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold`}
        >
          {badgeContent}
        </span>
      </button>

      {/* Dropdown */}
      {isDropdownVisible && (
        <div className="absolute right-0 mt-3 w-[420px] max-h-[320px] overflow-y-auto bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
          <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-lg font-bold text-gray-800">Notifikasi</h3>
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center">
              <img src="/bgnotif.png" alt="Tidak ada notifikasi" className="mx-auto w-35 h-35 object-contain mb-2" />
              <h2 className="text-md font-semibold text-gray-800 mb-1">Tidak ada notifikasi</h2>
              <p className="text-sm text-gray-500">Tidak ada notifikasi masuk</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notif, index) => (
                <NotifikasiItem key={notif.id} {...notif} index={index} />
              ))}
            </div>
          )}

          <div className="p-3 flex justify-center border-t border-gray-200 sticky bottom-0 bg-white z-10">
            <button
              onClick={handleMarkAllRead}
              disabled={notifications.length === 0}
              className={`text-sm font-semibold transition ${
                notifications.length === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:text-green-700"
              }`}
            >
              Tandai semua sudah dibaca
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotifikasiCust