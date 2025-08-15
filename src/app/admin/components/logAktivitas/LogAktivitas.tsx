import React from 'react';
import './LogAktivitas.css'; 

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

const getTypeClass = (type: string): string => {
  switch (type) {
    case 'Update Pesanan':
      return 'update-pesanan';
    case 'Update Produk':
      return 'update-produk';
    case 'Update Kategori':
      return 'update-kategori';
    case 'Update Notifikasi':
      return 'update-notifikasi';
    default:
      return '';
  }
};

const ActivityLogCard: React.FC = () => {
  return (
    <div className="activity-log-card">
      <div className="card-header">
        <h2>Log Aktivitas Terakhir</h2>
        <p>Ini adalah daftar aktivitas terbaru.</p>
      </div>
      <div className="card-body">
        <div className="log-header">
          <div className="header-item time">WAKTU</div>
          <div className="header-item activity">AKTIVITAS</div>
          <div className="header-item type">TIPE AKTIVITAS</div>
        </div>
        <div className="log-list">
          {activityLogs.map((log, index) => (
            <div key={index} className="log-entry">
              <div className="log-time">{log.time}</div>
              <div className="log-activity">{log.activity}</div>
              <div className={`log-type ${getTypeClass(log.type)}`}>
                <span>{log.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogCard;