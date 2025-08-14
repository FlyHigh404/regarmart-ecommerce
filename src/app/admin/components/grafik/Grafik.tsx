import React, { useState } from 'react';
import './grafik.css';

interface SalesData {
  month?: string;
  day?: string;
  year?: number;
  sales: number;
}

const salesDataBulan: SalesData[] = [
  { month: 'Jan', sales: 45 },
  { month: 'Feb', sales: 65 },
  { month: 'Mar', sales: 80 },
  { month: 'Apr', sales: 75 },
  { month: 'May', sales: 110 },
  { month: 'Jun', sales: 155 },
  { month: 'Jul', sales: 140 },
  { month: 'Aug', sales: 122, year: 2025 },
  { month: 'Sep', sales: 90 },
  { month: 'Oct', sales: 145 },
  { month: 'Nov', sales: 185 },
  { month: 'Dec', sales: 148 },
];

const salesDataMinggu: SalesData[] = [
  { day: 'Sen', sales: 20 },
  { day: 'Sel', sales: 35 },
  { day: 'Rab', sales: 50 },
  { day: 'Kam', sales: 30 },
  { day: 'Jum', sales: 45 },
  { day: 'Sab', sales: 60 },
  { day: 'Min', sales: 40 },
];

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
            // barHeight didefinisikan di sini
            const barHeight = (data.sales / maxSales) * 100;
            return (
              <div
                key={data.month || data.day}
                className="bar-wrapper"
                onMouseEnter={() => setActiveBarIndex(index)}
                onMouseLeave={() => setActiveBarIndex(null)}
              >
                <div
                  className="bar"
                  style={{ height: `${barHeight}%` }}
                ></div>
                {activeBarIndex === index && (
                  <div 
                    className="tooltip" 
                    style={{ bottom: `${barHeight}%` }} 
                  >
                    <span className="tooltip-dot"></span>
                    <div className="tooltip-content">
                      <p>{data.month || data.day}{data.year ? `, ${data.year}` : ''}</p>
                      <p>Penjualan: Rp{data.sales}Jt</p>
                    </div>
                  </div>
                )}
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