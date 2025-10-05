"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

interface NotificationItemData {
    id: string;
    message: string;
    createdAt: Date; 
    orderNumber: string;
    productName: string;
    imageUrl: string;
    status: string;
}

interface NotifItemProps extends NotificationItemData {
    index: number; 
}

const formatDateTime = (date: Date) => {
    const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const dateString = date.toLocaleDateString('id-ID', optionsDate).replace(/\//g, '-');
    const timeString = date.toLocaleTimeString('id-ID', optionsTime);
    
    return { dateString, timeString };
};

const NotifikasiItem: React.FC<NotifItemProps> = ({ 
    createdAt, orderNumber, productName, imageUrl, status, index 
}) => {
    const { dateString, timeString } = formatDateTime(createdAt);
    const isGreenBackground = index % 2 !== 0; 
    const rowClass = isGreenBackground ? 'bg-white' : 'bg-green-50';

    return (
        <div className={`flex p-2.5 border-b border-gray-200 cursor-pointer ${rowClass}`}>
            <div className="w-8 h-8 mr-3 flex-shrink-0 mt-0.5"> 
                <img 
                    src={imageUrl} 
                    alt={productName} 
                    className="w-full h-full object-cover rounded-md" 
                />
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
                    Periksa kelengkapan untuk pesanan **#{orderNumber}**. Puas dengan pesananmu? Jangan lupa untuk memberikan penilaian produk kami.
                </p>
            </div>
        </div>
    );
};

// --- DUMMY DATA ---
const createDummyNotifications = (count: number): NotificationItemData[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `id-${i}`, 
        productName: `Produk ${i + 1}`, 
        orderNumber: `INV-${1000 + i}`, 
        imageUrl: i % 2 === 0 ? '/ktgsayur.png' : '/ktgbuah.png', 
        createdAt: new Date(Date.now() - 1000 * 60 * (i * 2 + 1)),
        status: 'Pesananmu telah Tiba di Tujuan', 
        message: `Pesan ${i + 1}`
    }));
};

const initialDummyNotifications = createDummyNotifications(12);
const DROPDOWN_MAX_HEIGHT_CLASS = 'max-h-[320px]'; 


interface NotifikasiCustProps {
    notificationCount: number; 
}

const NotifikasiCust: React.FC<NotifikasiCustProps> = ({ notificationCount: externalCount }) => {
    const router = useRouter();
    const [isClickedOpen, setIsClickedOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeNotifications, setActiveNotifications] = useState(initialDummyNotifications);
    const componentRef = useRef<HTMLDivElement>(null);
    const isDropdownVisible = isClickedOpen || isHovered;
    const actualNotificationCount = activeNotifications.length;

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

    const handleMarkAllRead = useCallback(() => {
        setActiveNotifications([]);
        setIsClickedOpen(false);
        setIsHovered(false);
        console.log('Semua notifikasi ditandai sudah dibaca.');
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
                ${isHovered ? 'scale-110' : 'scale-100'}`
                } 
            />
                
                {/* Badge jumlah notifikasi */}
                {(actualNotificationCount >= 0) ? (
                    <span 
                     className={`absolute -top-1 -right-1 w-5 h-5 
                    bg-orange-500 
                    text-white text-xs rounded-full flex items-center justify-center font-bold`}
                    >
                        {badgeContent}
                    </span>
                ) : null}
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

                    {/* GUNAKAN activeNotifications UNTUK KONDISI KOSONG */}
                    {activeNotifications.length === 0 ? (
                        <div className="p-4 text-center">
                            <img 
                                src="/bgnotif.png" 
                                alt="Tidak ada notifikasi" 
                                className="mx-auto w-35 h-35 object-contain mb-2"
                            />
                            <h2
                                className="text-md font-semibold text-gray-800 mb-1"
                            >
                                Tidak ada notifikasi
                            </h2> 	
                            <p className="text-sm text-gray-500">
                                Tidak ada notifikasi masuk
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {activeNotifications.map((notif, index) => (
                                <NotifikasiItem key={notif.id} {...notif} index={index} />
                            ))}
                        </div>
                    )}
                    
                    <div className="p-3 flex justify-center border-t border-gray-200 sticky bottom-0 bg-white z-10">
                        <button 
                            onClick={handleMarkAllRead}
                            disabled={activeNotifications.length === 0}
                            className={`text-sm font-semibold transition ${
                                activeNotifications.length === 0
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-green-600 hover:text-green-700'
                            }`}
                        >
                            Tandai semua sudah dibaca
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotifikasiCust;