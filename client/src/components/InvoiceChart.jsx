import React from 'react';

import { motion } from 'framer-motion';

const InvoiceChart = ({ invoices }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Filter invoices for the current month
  const currentMonthInvoices = invoices.filter(invoice => {
    const invoiceDate = new Date(invoice.Date);
    return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear;
  });

  // Calculate due and not due counts
  const totalInvoices = currentMonthInvoices.length;
  const dueInvoices = currentMonthInvoices.filter(invoice => invoice.IsDue).length;

  // Ensure percentages add up to 100
  const duePercentage = totalInvoices > 0 ? Math.round((dueInvoices / totalInvoices) * 100) : 0;
  const notDuePercentage = totalInvoices > 0 ? 100 - duePercentage : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative pt-8 hidden sm:block bg-gradient-to-br from-[#5e2e2e]/50 to-[#7a3e3e]/50 backdrop-blur-md p-6 rounded-xl border border-red-800/20"
    > 
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
      >
        <div className="text-center z-10">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Invoice</h2>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Summary</h2>
        </div>
      </motion.div>
      
      <svg viewBox="0 0 36 36" className="w-full max-w-md mx-auto rounded-full">
        {/* Background circle */}
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#444" strokeWidth="0.5" />

        {/* Due (Red) */}
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ef4444" strokeWidth="11.8" strokeDasharray={`${duePercentage} ${100 - duePercentage}`} strokeDashoffset="0" />

        {/* Not Due (Green) */}
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#22c55e" strokeWidth="11.8" strokeDasharray={`${notDuePercentage} ${100 - notDuePercentage}`} strokeDashoffset={`-${duePercentage}`} />

        {/* Inner circle */}
        <circle cx="18" cy="18" r="10" fill="#7f1d1d" />
      </svg>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-around mt-6 pt-4 border-t border-red-800/20"
      >
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 mr-2 rounded-full"></div>
          <span className="text-gray-200">Paid</span>
          <span className="ml-2 text-2xl font-bold text-green-400">{notDuePercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-400 mr-2 rounded-full"></div>
          <span className="text-gray-200">Pending</span>
          <span className="ml-2 text-2xl font-bold text-red-400">{duePercentage}%</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceChart;