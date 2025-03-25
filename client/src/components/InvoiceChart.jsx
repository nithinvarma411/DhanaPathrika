import React from 'react';

const InvoiceChart = () => {
  return (
    <div className="relative pt-8">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="text-center z-10">
          <h2 className="text-2xl font-bold">Invoice</h2>
          <h2 className="text-2xl font-bold">Summary</h2>
        </div>
      </div>
      
      <svg viewBox="0 0 36 36" className="w-full max-w-md mx-auto rounded-full">
        {/* Background circle */}
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#444" strokeWidth="0.5" />

        {/* Paid - 70% (Green) */}
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#a3e635" strokeWidth="11.8" strokeDasharray="70 30" strokeDashoffset="0" />

        {/* Pending - 20% (Orange) */}
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f97316" strokeWidth="11.8" strokeDasharray="20 80" strokeDashoffset="-70" />

        {/* Invested - 10% (Blue) */}
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#60a5fa" strokeWidth="11.8" strokeDasharray="10 90" strokeDashoffset="-90" />

        {/* Inner circle */}
        <circle cx="18" cy="18" r="10" fill="#7f1d1d" />
      </svg>
      
      {/* Labels */}
      <div className="flex justify-around mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 mr-2"></div>
          <span>Paid</span>
          <span className="ml-2 text-2xl">70%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-400 mr-2"></div>
          <span>Pending</span>
          <span className="ml-2 text-2xl">20%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 mr-2"></div>
          <span>Invested</span>
          <span className="ml-2 text-2xl">10%</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceChart;