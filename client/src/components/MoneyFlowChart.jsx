import React from 'react';
import Button from './Button';

const MoneyFlowChart = () => {
  return (
    <div className="hidden sm:block bg-transparent rounded-3xl p-6 text-white shadow-lg outline-3 outline-white h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-400">Money Flow</h2>
        <div className="flex space-x-2">
          <Button variant="primary">Money Flow</Button>
          <div className="flex items-center bg-red-950 rounded-full px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>6 Month</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="h-60 relative">
        <svg className="w-full h-full" viewBox="0 0 600 200">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Y-axis labels */}
          <text x="0" y="20" fill="white">$100K</text>
          <text x="0" y="60" fill="white">$75K</text>
          <text x="0" y="100" fill="white">$50K</text>
          <text x="0" y="140" fill="white">$25K</text>
          <text x="0" y="180" fill="white">$0K</text>

          {/* X-axis labels */}
          <text x="50" y="200" fill="white">Jan</text>
          <text x="130" y="200" fill="white">Feb</text>
          <text x="210" y="200" fill="white">Mar</text>
          <text x="290" y="200" fill="white">Apr</text>
          <text x="370" y="200" fill="white">May</text>
          <text x="450" y="200" fill="white">Jun</text>

          {/* Vertical grid lines */}
          <line x1="50" y1="0" x2="50" y2="180" stroke="white" strokeOpacity="0.2" strokeDasharray="5,5" />
          <line x1="130" y1="0" x2="130" y2="180" stroke="white" strokeOpacity="0.2" strokeDasharray="5,5" />
          <line x1="210" y1="0" x2="210" y2="180" stroke="white" strokeOpacity="0.2" strokeDasharray="5,5" />
          <line x1="290" y1="0" x2="290" y2="180" stroke="white" strokeOpacity="0.2" strokeDasharray="5,5" />
          <line x1="370" y1="0" x2="370" y2="180" stroke="white" strokeOpacity="0.2" strokeDasharray="5,5" />
          <line x1="450" y1="0" x2="450" y2="180" stroke="white" strokeOpacity="0.2" strokeDasharray="5,5" />
          <line x1="530" y1="0" x2="530" y2="180" stroke="white" strokeOpacity="0.2" strokeDasharray="5,5" />

          {/* Area chart */}
          <path 
            d="M50,140 C90,130 110,90 130,70 C150,50 190,80 210,100 C230,120 270,110 290,70 C310,30 350,20 370,30 C410,40 450,20 530,20 L530,180 L50,180 Z" 
            fill="url(#gradient)" 
            stroke="#ef4444" 
            strokeWidth="3"
          />

          {/* Data point with label */}
          <circle cx="210" cy="100" r="8" fill="#ef4444" />
          <rect x="190" y="80" width="40" height="20" rx="10" fill="#ef4444" />
          <text x="210" y="95" fill="white" fontSize="12" textAnchor="middle">$52K</text>
        </svg>
      </div>
    </div>
  );
};

export default MoneyFlowChart;
