import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StatsCard from './StatsCard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StatsSummary = () => {
  const [stats, setStats] = useState({
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
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/getInvoices`, { withCredentials: true });
        const data = response.data;

        if (response.status === 201) {
          const invoices = data.invoices;
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

            const totalAmount = invoice.Items.reduce((sum, item) => sum + item.AmountPerItem * item.Quantity, 0);
            const dueAmount = totalAmount - invoice.AmountPaid;

            if (invoiceMonth === currentMonth && invoiceYear === currentYear) {
              totalRevenue += invoice.AmountPaid;
              currentInvoices++;

              if (invoice.DueDate) {  
                const [year, month, day] = invoice.DueDate.split("-").map(Number);
                const dueDate = new Date(year, month - 1, day);
                if (!isNaN(dueDate.getTime()) && dueDate < currentDate) {
                  overdueInvoices++;
                }
              }

              if (dueAmount > 0) pendingBills++;
            } else if (invoiceMonth === prevMonth && invoiceYear === prevYear) {
              prevRevenue += invoice.AmountPaid;
              prevInvoices++;
              
              if (invoice.DueDate) {
                const [year, month, day] = invoice.DueDate.split("-").map(Number);
                const dueDate = new Date(year, month - 1, day);
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

          setStats({
            totalRevenue,
            totalInvoices: currentInvoices,
            pendingBills,
            overdueInvoices,
            revenueChange,
            invoiceChange,
            pendingChange,
            overdueChange,
          });
        } else {
          toast.error("Error fetching invoices: " + data.message);
        }
      } catch (error) {
        toast.error("Error fetching invoices: " + error.message);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="flex overflow-x-auto px-4 gap-4 mt-6 whitespace-nowrap scrollbar-hide">
      <StatsCard 
        title="Total Revenue this Month" 
        value={`INR ${stats.totalRevenue.toFixed(2)}`} 
        change={stats.revenueChange} 
        isPositive={stats.revenueChange !== "N/A" && parseFloat(stats.revenueChange) >= 0} 
      />
      
      <StatsCard 
        title="Total Invoices this Month" 
        value={stats.totalInvoices} 
        change={stats.invoiceChange} 
        isPositive={stats.invoiceChange !== "N/A" && parseFloat(stats.invoiceChange) >= 0} 
      />
      
      <StatsCard 
        title="Pending Bills this Month" 
        value={stats.pendingBills} 
        change={stats.pendingChange} 
        isPositive={!stats.pendingChange !== "N/A" && !parseFloat(stats.pendingChange) <= 0} 
      />
      
      <StatsCard 
        title="Overdue Invoices" 
        value={stats.overdueInvoices} 
        change={stats.overdueChange} 
        isPositive={!stats.overdueChange !== "N/A" && !parseFloat(stats.overdueChange) <= 0} 
      />
    </div>
  );
};

export default StatsSummary;
