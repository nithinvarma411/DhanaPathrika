import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip } from 'chart.js';
import Button from './Button';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

const MoneyFlowChart = () => {
  const [monthlyIncome, setMonthlyIncome] = useState(Array(12).fill(null)); // Initialize with null for all months
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Track the current year

  useEffect(() => {
    const fetchMonthlyIncome = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/monthly-income`, { withCredentials: true });
        const incomeData = response.data.data;

        // Reset data if the year changes
        const now = new Date();
        if (now.getFullYear() !== currentYear) {
          setMonthlyIncome(Array(12).fill(null)); // Reset monthly income
          setCurrentYear(now.getFullYear()); // Update the current year
          return;
        }

        // Map income data to the correct months
        const updatedIncome = Array(12).fill(null);
        incomeData.forEach((income, index) => {
          if (income > 0) {
            updatedIncome[index] = income;
          }
        });

        setMonthlyIncome(updatedIncome);
      } catch (error) {
        console.error('Error fetching monthly income:', error);
      }
    };

    fetchMonthlyIncome();
  }, [currentYear]);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Monthly Income',
        data: monthlyIncome,
        fill: true,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ef4444',
        pointHoverRadius: 6,
        segment: {
          borderColor: ctx => {
            const { p0, p1 } = ctx;
            return p1.raw > p0.raw ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)';
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        enabled: true,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1f2937',
        bodyColor: '#1f2937',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: context => {
            const income = context.raw;
            return income ? `Income: ₹${income.toLocaleString()}` : 'No data';
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y: {
        min: 0,
        suggestedMax: (() => {
          const maxIncome = Math.max(...monthlyIncome.filter(i => i !== null), 0);
          return Math.ceil(Math.max(400000, maxIncome) / 20000) * 20000;
        })(),
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
          font: {
            size: 12,
            weight: 'bold'
          },
          stepSize: 20000,
          callback: value => (value === 0 ? '0' : `${value / 1000}K`),
        },
      },
    },
  };

  return (
    <div className="hidden lg:block h-full">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl h-full w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Money Flow
          </h2>
          <Button variant="primary" className="px-6 py-2 text-sm">Money Flow</Button>
        </div>
        <div className="h-[calc(100%-5rem)]">
          {monthlyIncome.some(income => income !== null) ? (
            <Line data={data} options={options} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg text-gray-300">No data available for the selected months.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyFlowChart;
