import React, { useState } from 'react';

interface SalesData {
  month?: string;
  day?: string;
  year: number;
  sales: number;
}

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

const Grafik: React.FC = () => {
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [filterAktif, setFilterAktif] = useState<'bulan' | 'minggu'>('bulan');

  const maxSales = 240;
  const yAxisLabels = [240, 200, 160, 120, 80, 40, 0];

  const dataTampil = filterAktif === 'bulan' ? salesDataBulan : salesDataMinggu;
  
  // Hitung min-width berdasarkan jumlah data
  const minChartWidth = dataTampil.length * 60; // 60px per bar (48px bar + 12px gap)

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Grafik Penjualan</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filterAktif === 'bulan' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilterAktif('bulan')}
          >
            Bulan
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filterAktif === 'minggu' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setFilterAktif('minggu')}
          >
            Minggu
          </button>
        </div>
      </div>
      
      {/* Chart Container - dengan scroll horizontal di mobile */}
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex" style={{ minWidth: `${minChartWidth + 64}px` }}>
          {/* Y-Axis Labels - Tanpa sticky */}
          <div className="w-16 flex-shrink-0 pr-2 bg-white">
            <div className="h-64 md:h-72 flex flex-col justify-between text-right">
              {yAxisLabels.map((label) => (
                <div key={label} className="text-xs text-gray-500 -mt-2 first:mt-0">
                  Rp{label}Jt
                </div>
              ))}
            </div>
          </div>

          {/* Chart Area Wrapper */}
          <div className="flex-1">
            {/* Chart Area */}
            <div className="relative" style={{ minWidth: `${minChartWidth}px` }}>
              {/* Horizontal Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yAxisLabels.map((label, index) => (
                  <div 
                    key={label} 
                    className={`border-t ${index === yAxisLabels.length - 1 ? 'border-gray-400' : 'border-gray-200'}`}
                  />
                ))}
              </div>

              {/* Bars Container */}
              <div className="h-64 md:h-72 flex items-end justify-around gap-2 px-2 relative z-10">
                {dataTampil.map((data, index) => {
                  const barHeight = (data.sales / maxSales) * 100;
                  return (
                    <div
                      key={data.month || data.day}
                      className="relative w-12 flex flex-col items-center h-full justify-end group"
                    >
                      {/* Tooltip */}
                      {activeBarIndex === index && (
                        <div 
                          className="absolute left-1/2 -translate-x-1/2 bg-gray-800 text-white rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-20 pointer-events-none"
                          style={{ bottom: `calc(${barHeight}% + 12px)` }}
                        >
                          <div className="text-xs">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="w-2 h-2 rounded-full bg-green-400"></span>
                              <span>{data.month || data.day}, {data.year}</span>
                            </div>
                            <div>
                              Penjualan: <span className="font-bold">Rp{data.sales}Jt</span>
                            </div>
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                        </div>
                      )}
                      
                      {/* Bar */}
                      <div 
                        className="w-full bg-green-400 rounded-t hover:bg-green-500 transition-all cursor-pointer"
                        style={{ height: `${barHeight}%` }}
                        onMouseEnter={() => setActiveBarIndex(index)}
                        onMouseLeave={() => setActiveBarIndex(null)}
                        onTouchStart={() => setActiveBarIndex(index)}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-around text-xs text-gray-500 px-2 mt-2" style={{ minWidth: `${minChartWidth}px` }}>
              {dataTampil.map((data) => (
                <div key={data.month || data.day} className="w-12 text-center">
                  {data.month || data.day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grafik;