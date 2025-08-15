import React, { useState } from 'react';
import './grafik.css';

// =========================================================
// DEFINISI TIPE DATA TSX
// =========================================================
interface SalesData {
  month?: string;
  day?: string;
  year: number;
  sales: number;
}

// =========================================================
// DATA DUMMY DENGAN TAHUN
// =========================================================
const salesDataBulan: SalesData[] = [
  { month: 'Jan', sales: 45, year: 2025 },
  { month: 'Feb', sales: 65, year: 2025 },
  { month: 'Mar', sales: 80, year: 2025 },
  { month: 'Apr', sales: 75, year: 2025 },
  { month: 'May', sales: 110, year: 2025 },
  { month: 'Jun', sales: 155, year: 2025 },
  { month: 'Jul', sales: 140, year: 2025 },
  { month: 'Aug', sales: 122, year: 2025 },
  { month: 'Sep', sales: 90, year: 2025 },
  { month: 'Oct', sales: 145, year: 2025 },
  { month: 'Nov', sales: 185, year: 2025 },
  { month: 'Dec', sales: 148, year: 2025 },
];

const salesDataMinggu: SalesData[] = [
  { day: 'Sen', sales: 20, year: 2025 },
  { day: 'Sel', sales: 35, year: 2025 },
  { day: 'Rab', sales: 50, year: 2025 },
  { day: 'Kam', sales: 30, year: 2025 },
  { day: 'Jum', sales: 45, year: 2025 },
  { day: 'Sab', sales: 60, year: 2025 },
  { day: 'Min', sales: 40, year: 2025 },
];

// =========================================================
// KOMPONEN GRAFIK UTAMA
// =========================================================
const Grafik: React.FC = () => {
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [filterAktif, setFilterAktif] = useState<'bulan' | 'minggu'>('bulan');

  const maxSales = 240;
  const yAxisLabels = [240, 200, 160, 120, 80, 40, 0];

  const dataTampil = filterAktif === 'bulan' ? salesDataBulan : salesDataMinggu;

  return (
    <div className="grafik-card">
      <div className="grafik-header">
        <h2 className="grafik-title">Grafik Penjualan</h2>
        <div className="grafik-controls">
          <button
            className={`grafik-button ${filterAktif === 'bulan' ? 'active' : ''}`}
            onClick={() => setFilterAktif('bulan')}
          >
            Bulan
          </button>
          <button
            className={`grafik-button ${filterAktif === 'minggu' ? 'active' : ''}`}
            onClick={() => setFilterAktif('minggu')}
          >
            Minggu
          </button>
        </div>
      </div>
      <div className="grafik-body">
        <div className="y-axis">
          {yAxisLabels.map((label) => (
            <span key={label}>Rp{label}Jt</span>
          ))}
        </div>
        <div className="bar-chart">
          {dataTampil.map((data, index) => {
            const barHeight = (data.sales / maxSales) * 100;
            return (
              <div
                key={data.month || data.day}
                className="bar-wrapper"
                onMouseEnter={() => setActiveBarIndex(index)}
                onMouseLeave={() => setActiveBarIndex(null)}
              >
                {activeBarIndex === index && (
                  <div className="tooltip" style={{ bottom: `calc(${barHeight}% + 10px)` }}>
                    <div className="tooltip-content">
                      <p className="font-base">
                        <span className="tooltip-dot"></span>
                        {data.month || data.day}, {data.year}
                      </p>
                      <p>Penjualan: <span className="font-bold">Rp{data.sales}Jt</span></p>
                    </div>
                  </div>
                )}
                <div className="bar" style={{ height: `${barHeight}%` }}></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="x-axis">
        {dataTampil.map((data) => (
          <span key={data.month || data.day}>{data.month || data.day}</span>
        ))}
      </div>
    </div>
  );
};

export default Grafik;
