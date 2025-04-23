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
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // All months
    datasets: [
      {
        label: 'Monthly Income',
        data: monthlyIncome,
        fill: false,
        borderColor: '#ef4444', // Default color
        tension: 0.4,
        segment: {
          borderColor: ctx => {
            const { p0, p1 } = ctx;
            return p1.raw > p0.raw ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'; // Green for increase, red for decrease
          },
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true, // Ensure tooltips are enabled
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
      },
      y: {
        min: 0, // Start the y-axis at 0
        suggestedMax: (() => {
          const maxIncome = Math.max(...monthlyIncome.filter(i => i !== null), 0);
          return Math.ceil(Math.max(400000, maxIncome) / 20000) * 20000; // Round up to the nearest 20,000
        })(),
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          color: 'white',
          stepSize: 20000, // Fixed step size of 20,000
          callback: value => (value === 0 ? '0' : `${value / 1000}K`), // Format ticks as "0", "20K", "40K", etc.
        },
      },
    },
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-transparent rounded-3xl p-6 text-white shadow-lg outline-3 outline-white h-full w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-400">Money Flow</h2>
          <div className="flex space-x-2">
            <Button variant="primary">Money Flow</Button>
          </div>
        </div>
        <div className="h-full">
          {monthlyIncome.some(income => income !== null) ? (
            <Line data={data} options={options} />
          ) : (
            <p className="text-center text-white">No data available for the selected months.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoneyFlowChart;
