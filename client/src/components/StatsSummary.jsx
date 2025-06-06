import React, { useEffect, useState } from 'react';
import StatsCard from './StatsCard';
import 'react-toastify/dist/ReactToastify.css';

const StatsSummary = ({ invoices }) => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalInvoices: 0,
    pendingBills: 0,
    overdueInvoices: 0,
    revenueChange: "N/A",
    invoiceChange: "N/A",
    pendingChange: "N/A",
    overdueChange: "N/A",
  });

  useEffect(() => {
    if (!invoices) return;

    let totalRevenue = 0, prevRevenue = 0;
    let pendingBills = 0, prevPendingBills = 0;
    let overdueInvoices = 0, prevOverdueInvoices = 0;
    let currentInvoices = 0, prevInvoices = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    const currentYear = currentDate.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    invoices.forEach(invoice => {
      const invoiceDate = new Date(invoice.Date);
      const invoiceMonth = invoiceDate.getMonth();
      const invoiceYear = invoiceDate.getFullYear();

      const totalAmount = invoice.Items.reduce((sum, item) => sum + item.AmountPerItem * item.Quantity, 0) - (invoice.Discount);
      const dueAmount = totalAmount - invoice.AmountPaid;

      if (invoiceMonth === currentMonth && invoiceYear === currentYear) {
        totalRevenue += invoice.AmountPaid;
        currentInvoices++;

        if (invoice.DueDate) {  
          const dueDate = new Date(invoice.DueDate);
          if (!isNaN(dueDate.getTime()) && dueDate < currentDate) {
            overdueInvoices++;
          }
        }

        if (dueAmount > 0) pendingBills++;
      } else if (invoiceMonth === prevMonth && invoiceYear === prevYear) {
        prevRevenue += invoice.AmountPaid;
        prevInvoices++;
        
        if (invoice.DueDate) {
          const dueDate = new Date(invoice.DueDate);
          if (!isNaN(dueDate.getTime()) && dueDate < currentDate) {
            prevOverdueInvoices++;
          }
        }
        
        if (dueAmount > 0) prevPendingBills++;
      }
    });

    const revenueChange = prevRevenue ? (((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(2) + "%" : "N/A";
    const invoiceChange = prevInvoices ? (((currentInvoices - prevInvoices) / prevInvoices) * 100).toFixed(2) + "%" : "N/A";
    const pendingChange = prevPendingBills ? (((pendingBills - prevPendingBills) / prevPendingBills) * 100).toFixed(2) + "%" : "N/A";
    const overdueChange = prevOverdueInvoices ? (((overdueInvoices - prevOverdueInvoices) / prevOverdueInvoices) * 100).toFixed(2) + "%" : "N/A";

    setSummary({
      totalRevenue,
      totalInvoices: currentInvoices,
      pendingBills,
      overdueInvoices,
      revenueChange,
      invoiceChange,
      pendingChange,
      overdueChange,
    });

  }, [invoices]);

  return (
    <div className="flex overflow-x-auto px-4 gap-4 mt-6 whitespace-nowrap scrollbar-hide">
      <StatsCard 
        title="Total Revenue this Month" 
        value={`INR ${summary.totalRevenue.toFixed(2)}`} 
        change={summary.revenueChange} 
        isPositive={summary.revenueChange !== "N/A" && parseFloat(summary.revenueChange) >= 0} 
      />
      
      <StatsCard 
        title="Total Invoices this Month" 
        value={summary.totalInvoices} 
        change={summary.invoiceChange} 
        isPositive={summary.invoiceChange !== "N/A" && parseFloat(summary.invoiceChange) >= 0} 
      />
      
      <StatsCard 
        title="Pending Bills this Month" 
        value={summary.pendingBills} 
        change={summary.pendingChange} 
        isPositive={!summary.pendingChange !== "N/A" && !parseFloat(summary.pendingChange) <= 0} 
      />
      
      <StatsCard 
        title="Overdue Invoices" 
        value={summary.overdueInvoices} 
        change={summary.overdueChange} 
        isPositive={!summary.overdueChange !== "N/A" && !parseFloat(summary.overdueChange) <= 0} 
      />
    </div>
  );
};

export default StatsSummary;
