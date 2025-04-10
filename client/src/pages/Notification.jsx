import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import bgImage from "../assets/bg.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";

const Notification = () => {
  const [notifications, setNotifications] = useState({
    overdueInvoices: [],
    lowStockItems: [],
  });
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchNotifications = async () => {
    try {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const invoiceResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/getInvoices`,
        { withCredentials: true }
      );
      const stockResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/getStock`,
        { withCredentials: true }
      );

      const invoices = invoiceResponse.data.invoices;
      const stocks = stockResponse.data;

      const currentDate = new Date();
      let overdueInvoices = [];
      let lowStockItems = [];

      invoices.forEach((invoice) => {
        if (invoice.DueDate) {
          const parts = invoice.DueDate.split("-");
          if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            const dueDate = new Date(year, month - 1, day);

            if (!isNaN(dueDate.getTime()) && dueDate < currentDate) {
              overdueInvoices.push({
                customer: invoice.CustomerName,
                amount: invoice.AmountPaid,
                dueDate: new Date(invoice.DueDate)
                  .toLocaleDateString("en-GB")
                  .split("/")
                  .join("-"),
              });
            }
          }
        }
      });

      stocks.forEach((stock) => {
        if (stock.AvailableQuantity < stock.MinQuantity) {
          lowStockItems.push({
            name: stock.ItemName,
            available: stock.AvailableQuantity,
            minRequired: stock.MinQuantity,
          });
        }
      });

      setNotifications({ overdueInvoices, lowStockItems });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: "#4a0d16",
      }}
    >
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <ClipLoader size={100} color="white" loading={loading} />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Overdue Invoices */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 min-w-[300px] max-w-[500px] h-screen bg-white backdrop-blur shadow-xl rounded-2xl p-6 transition hover:scale-[1.01] flex flex-col"
          >
            <h2 className="text-red-600 text-3xl font-bold flex items-center gap-2 mb-2">
              ⏰ Overdue Invoices
            </h2>
            <hr className="border-red-300 border-2 mb-4" />
            <div className="overflow-y-auto flex-1 pr-2">
              {notifications.overdueInvoices.length === 0 ? (
                <p className="text-gray-600 text-lg">
                  🎉 All invoices are on time!
                </p>
              ) : (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.2,
                      },
                    },
                  }}
                  className="space-y-3"
                >
                  {notifications.overdueInvoices.map((invoice, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                      className="p-4 bg-red-100 hover:bg-red-200 rounded-lg shadow-sm text-gray-900"
                    >
                      <span className="font-semibold">
                        📢 ₹{invoice.amount}
                      </span>{" "}
                      from{" "}
                      <span className="font-semibold">{invoice.customer}</span>{" "}
                      was due on{" "}
                      <span className="text-red-600">{invoice.dueDate}</span>.
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>

          {/* Low Stock Items */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 min-w-[300px] max-w-[500px] h-screen bg-white backdrop-blur shadow-xl rounded-2xl p-6 transition hover:scale-[1.01] flex flex-col"
          >
            <h2 className="text-yellow-700 text-3xl font-bold flex items-center gap-2 mb-2">
              📦 Low Stock Items
            </h2>
            <hr className="border-yellow-300 border-2 mb-4" />
            <div className="overflow-y-auto flex-1 pr-2">
              {notifications.lowStockItems.length === 0 ? (
                <p className="text-gray-600 text-lg">
                  ✅ Stock levels look good!
                </p>
              ) : (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.2,
                      },
                    },
                  }}
                  className="space-y-3"
                >
                  {notifications.lowStockItems.map((stock, index) => (
                    <motion.li
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 30 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                      className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg shadow-sm text-gray-900"
                    >
                      ⚠️ <span className="font-semibold">{stock.name}</span>:{" "}
                      {stock.available} left (Min required: {stock.minRequired})
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Notification;
