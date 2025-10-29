"use client"
import React, { useState, useRef, useEffect, useCallback } from "react"
import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"

interface NotificationItemData {
<<<<<<< HEAD
  id: string
  message: string
  createdAt: Date
  orderNumber: string
  productName: string
  imageUrl: string
  status: string
=======
    id: string;
    message: string;
    createdAt: Date; 
    userId: string;
>>>>>>> 0173f99e8a3beeba0565631ed321b5e5eb2a7724
}

interface NotifItemProps extends NotificationItemData {
  index: number
}

<<<<<<< HEAD
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
=======
const formatDateTime = (date: Date | string) => {
    const dateObject = new Date(date);
    const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateString = dateObject.toLocaleDateString('id-ID', optionsDate).replace(/\//g, '-');
    const timeString = dateObject.toLocaleTimeString('id-ID', optionsTime);
    
    return { dateString, timeString };
};

const NotifikasiItem: React.FC<NotifItemProps> = ({ 
    id, message, createdAt, index 
}) => {
    const { dateString, timeString } = formatDateTime(createdAt);
    const isGreenBackground = index % 2 !== 0; 
    const rowClass = isGreenBackground ? 'bg-white' : 'bg-green-50';

    // Ekstrak informasi dari message jika diperlukan
    // Asumsi message mengandung informasi yang diperlukan
    const extractOrderInfo = (msg: string) => {
        // Anda bisa menyesuaikan logika parsing berdasarkan format message Anda
        const orderNumberMatch = msg.match(/#(\w+-\d+)/);
        const productMatch = msg.match(/produk\s+(.+?)(?=\s|$)/i);
        
        return {
            orderNumber: orderNumberMatch ? orderNumberMatch[1] : 'N/A',
            productName: productMatch ? productMatch[1] : 'Produk',
            status: msg.split('.')[0] || 'Notifikasi'
        };
    };

    const { orderNumber, productName, status } = extractOrderInfo(message);

    return (
        <div className={`flex p-2.5 border-b border-gray-200 cursor-pointer ${rowClass}`}>
            <div className="w-8 h-8 mr-3 flex-shrink-0 mt-0.5 bg-gray-200 rounded-md flex items-center justify-center">
                <div className="text-xs text-gray-600 font-semibold">
                    {orderNumber.slice(0, 3)}
                </div>
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                    <p className="font-semibold text-sm text-gray-800 truncate pr-2">
                        {status}
                    </p>
                    <span className="text-[10px] text-gray-500 flex-shrink-0 mt-0.5">
                        {dateString} | {timeString}
                    </span>
                </div>
                <p className="text-xs text-gray-600 leading-snug">
                    {message}
                </p>
            </div>
        </div>
    );
};

const DROPDOWN_MAX_HEIGHT_CLASS = 'max-h-[320px]'; 

interface NotifikasiCustProps {
    notificationCount?: number; 
}

const NotifikasiCust: React.FC<NotifikasiCustProps> = ({ notificationCount: externalCount }) => {
    const router = useRouter();
    const [isClickedOpen, setIsClickedOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [notifications, setNotifications] = useState<NotificationItemData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const isDropdownVisible = isClickedOpen || isHovered;
    const actualNotificationCount = notifications.length;

    // Fetch notifications dari API
    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/notifications');
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            setNotifications(data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Gagal memuat notifikasi');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch notifications ketika dropdown dibuka
    useEffect(() => {
        if (isDropdownVisible) {
            fetchNotifications();
        }
    }, [isDropdownVisible, fetchNotifications]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node) && isClickedOpen) {
                setIsClickedOpen(false);
                setIsHovered(false);
            }
        };
        if (isClickedOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isClickedOpen]);

    const handleIconClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsClickedOpen(prev => !prev);
        setIsHovered(false); 
    };

    const handleMarkAllRead = useCallback(async () => {
        try {
            // Jika Anda ingin implementasi mark as read, Anda perlu membuat API endpoint DELETE
            const response = await fetch('/api/notifications', {
                method: 'DELETE',
            });

            if (response.ok) {
                setNotifications([]);
                console.log('Semua notifikasi ditandai sudah dibaca.');
            } else {
                console.error('Gagal menandai notifikasi sebagai sudah dibaca');
            }
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        } finally {
            setIsClickedOpen(false);
            setIsHovered(false);
        }
    }, []);
    
    // Fungsi untuk menentukan konten badge
    const getBadgeContent = () => {
        if (actualNotificationCount === 0) return 0; 
        if (actualNotificationCount > 9) return '9+';
        return actualNotificationCount;
    };
    
    const badgeContent = getBadgeContent();

    return (
        <div 
            className="relative"
            ref={componentRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { 
                if (!isClickedOpen) {
                    setIsHovered(false);
                }
            }}
        >
            {/* Tombol Ikon Notifikasi (Bell) */}
            <button
                onClick={handleIconClick}
                className={`relative p-2 rounded-lg transition ${
                    isClickedOpen || isHovered ? 'bg-green-100' : 'hover:bg-green-100'
                }`}
                aria-expanded={isDropdownVisible}
                aria-haspopup="true"
                aria-controls="notification-dropdown"
            >
                <Bell 
                    className={`w-5 h-5 text-[#4BBF42] cursor-pointer transition-transform duration-200 ease-out 
                    ${isHovered ? 'scale-110' : 'scale-100'}`} 
                />
                
                {/* Badge jumlah notifikasi */}
                {(actualNotificationCount > 0) && (
                    <span 
                        className={`absolute -top-1 -right-1 w-5 h-5 
                        bg-orange-500 
                        text-white text-xs rounded-full flex items-center justify-center font-bold`}
                    >
                        {badgeContent}
                    </span>
                )}
            </button>

            {/* Dropdown Notifikasi */}
            {isDropdownVisible && (
                <div 
                    id="notification-dropdown"
                    className={`absolute right-0 mt-3 w-[420px] ${DROPDOWN_MAX_HEIGHT_CLASS} overflow-y-auto bg-white rounded-lg shadow-2xl z-50 border border-gray-200`}
                    style={{ zIndex: 60 }} 
                >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 shadow-md">
                        <h3 className="text-lg font-bold text-gray-800">Notifikasi</h3>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Memuat notifikasi...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="p-4 text-center">
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                            <button 
                                onClick={fetchNotifications}
                                className="text-green-600 text-sm font-semibold hover:text-green-700"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    )}

                    {/* Notifikasi Kosong */}
                    {!loading && !error && notifications.length === 0 && (
                        <div className="p-4 text-center">
                            <img 
                                src="/bgnotif.png" 
                                alt="Tidak ada notifikasi" 
                                className="mx-auto w-35 h-35 object-contain mb-2"
                            />
                            <h2 className="text-md font-semibold text-gray-800 mb-1">
                                Tidak ada notifikasi
                            </h2> 	
                            <p className="text-sm text-gray-500">
                                Tidak ada notifikasi masuk
                            </p>
                        </div>
                    )}

                    {/* List Notifikasi */}
                    {!loading && !error && notifications.length > 0 && (
                        <>
                            <div className="divide-y divide-gray-200">
                                {notifications.map((notif, index) => (
                                    <NotifikasiItem 
                                        key={notif.id} 
                                        {...notif} 
                                        index={index} 
                                    />
                                ))}
                            </div>
                            
                            <div className="p-3 flex justify-center border-t border-gray-200 sticky bottom-0 bg-white z-10">
                                <button 
                                    onClick={handleMarkAllRead}
                                    disabled={notifications.length === 0}
                                    className={`text-sm font-semibold transition ${
                                        notifications.length === 0
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-green-600 hover:text-green-700'
                                    }`}
                                >
                                    Tandai semua sudah dibaca
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
>>>>>>> 0173f99e8a3beeba0565631ed321b5e5eb2a7724
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