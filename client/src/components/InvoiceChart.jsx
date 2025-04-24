import React from 'react';

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
    <div className="relative pt-8 hidden sm:block"> {/* Hide on mobile */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="text-center z-10">
          <h2 className="text-2xl font-bold">Invoice</h2>
          <h2 className="text-2xl font-bold">Summary</h2>
        </div>
      </div>
      
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
      
      {/* Labels */}
      <div className="flex justify-around mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 mr-2"></div>
          <span>Paid</span>
          <span className="ml-2 text-2xl">{notDuePercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-400 mr-2"></div>
          <span>Pending</span>
          <span className="ml-2 text-2xl">{duePercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceChart;