import React from 'react';

type ActivityLogEntry = {
  time: string;
  activity: string;
  type: string;
};

const activityLogs: ActivityLogEntry[] = [
  { time: '2 Menit lalu', activity: 'Pesanan #INV-0015 dibuat oleh Budi Santoso - Total Rp 350.000', type: 'Update Pesanan' },
  { time: '5 Menit lalu', activity: 'Status Pesanan #INV-0012 diubah menjadi Dikirim', type: 'Update Pesanan' },
  { time: '1 Jam lalu', activity: 'Produk Minyak Goreng Sunco stok bertambah 50 unit', type: 'Update Produk' },
  { time: '4 Jam lalu', activity: 'Kategori Sembako telah berhasil ditambahkan', type: 'Update Kategori' },
  { time: '10 Jam lalu', activity: 'Pembayaran QRIS untuk Pesanan #INV-0010 berhasil diterima', type: 'Update Notifikasi' },
  { time: '1 Hari lalu', activity: 'Produk Beras Ramos 5kg ditambahkan ke katalog', type: 'Update Produk' },
  { time: '1 Hari lalu', activity: 'Pesanan #INV-0010 dikonfirmasi selesai', type: 'Update Pesanan' },
  { time: '1 Hari lalu', activity: 'Stok Telur Ayam 1kg diupdate menjadi 100 unit', type: 'Update Produk' },
];

const getTypeStyle = (type: string): string => {
  switch (type) {
    case 'Update Pesanan':
      return 'bg-blue-100 text-blue-800';
    case 'Update Produk':
      return 'bg-green-100 text-green-800';
    case 'Update Kategori':
      return 'bg-purple-100 text-purple-800';
    case 'Update Notifikasi':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ActivityLogCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Log Aktivitas Terakhir</h2>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Ini adalah daftar aktivitas terbaru.</p>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Desktop Table Header - Hidden on mobile */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:px-4 lg:py-3 lg:bg-gray-50 lg:rounded-lg lg:mb-4">
          <div className="lg:col-span-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            WAKTU
          </div>
          <div className="lg:col-span-7 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            AKTIVITAS
          </div>
          <div className="lg:col-span-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            TIPE AKTIVITAS
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-3 sm:space-y-4">
          {activityLogs.map((log, index) => (
            <React.Fragment key={index}>
              {/* Mobile Layout */}
              <div className="block lg:hidden bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-500 font-medium">{log.time}</span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeStyle(log.type)}`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 leading-relaxed">{log.activity}</p>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4 lg:px-4 lg:py-4 lg:items-center lg:hover:bg-gray-50 lg:rounded-lg lg:transition-colors">
                <div className="lg:col-span-2 text-sm text-gray-600">
                  {log.time}
                </div>
                <div className="lg:col-span-7 text-sm text-gray-900">
                  {log.activity}
                </div>
                <div className="lg:col-span-3">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTypeStyle(log.type)}`}>
                    {log.type}
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Empty State (if no logs) */}
        {activityLogs.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-500">
              <p className="text-base sm:text-lg font-medium">Tidak ada aktivitas</p>
              <p className="text-sm mt-1">Log aktivitas akan muncul di sini</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogCard;