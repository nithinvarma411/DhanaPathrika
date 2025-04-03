import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    overdueInvoices: [],
    lowStockItems: [],
  });

  const hasFetched = useRef(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const fetchNotifications = async () => {
    try {
      if (hasFetched.current) return; // Prevent multiple calls
      hasFetched.current = true; // Mark as called

      const invoiceResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/getInvoices`,
        { withCredentials: true }
      );

      const stockResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/stock/getStock`,
        { withCredentials: true }
      );

      // console.log(stockResponse);
      

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
                name: invoice.CustomerName,
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
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleNotifications = () => {
    setNotificationOpen(!isNotificationOpen);
  };

  const handleLogOut = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out!",
      customClass: {
        popup: "custom-swal",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
          {},
          { withCredentials: true }
        );

        toast.success("Logout successful");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } catch (error) {
        toast.error("Logout failed. Try again.");
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <div className="relative">
      <header className="flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-red-500 transition"
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <img
            src={logo}
            alt="Dhana Pathrika Logo"
            className="w-10 h-10 mr-2"
          />
          <h1 className="text-2xl font-bold text-white">Dhana Pathrika</h1>
        </div>
        <div className="flex items-center relative">
          {/* Notification Icon */}
          <button
            className="mx-4 p-2 rounded-md hover:bg-gray-600 transition relative"
            onClick={toggleNotifications}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>

            {/* Notification Badge */}
            {notifications.overdueInvoices.length +
              notifications.lowStockItems.length >
              0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {notifications.overdueInvoices.length +
                  notifications.lowStockItems.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-12 bg-white text-black shadow-lg rounded-md w-64 z-100">
              <div className="p-4 border-b flex justify-between items-center font-bold">
                Notifications
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="text-red-500 text-lg"
                >
                  ❌
                </button>
              </div>

              <ul className="max-h-40 overflow-y-auto scrollbar-hide">
                {/* Overdue Invoices */}
                {notifications.overdueInvoices.length > 0 ? (
                  <>
                    <li className="p-2 font-bold text-red-600">
                      Overdue Invoices
                    </li>
                    {notifications.overdueInvoices.map((invoice, index) => (
                      <li key={index} className="p-2 hover:bg-gray-100">
                        {invoice.name} - ₹{invoice.amount} due on{" "}
                        {invoice.dueDate}
                      </li>
                    ))}
                  </>
                ) : (
                  <li className="p-2 text-gray-500">No overdue invoices</li>
                )}

                {/* Low Stock Items */}
                {notifications.lowStockItems.length > 0 ? (
                  <>
                    <li className="p-2 font-bold text-yellow-600">
                      Low Stock Items
                    </li>
                    {notifications.lowStockItems.map((stock, index) => (
                      <li key={index} className="p-2 hover:bg-gray-100">
                        {stock.name}: {stock.available} left (Min:{" "}
                        {stock.minRequired})
                      </li>
                    ))}
                  </>
                ) : (
                  <li className="p-2 text-gray-500">
                    All stock levels are sufficient
                  </li>
                )}
              </ul>

              <div className="p-2 text-center border-t text-blue-500 hover:underline cursor-pointer">
                View all
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogOut}
            className="hidden sm:flex bg-red-500 text-white px-4 py-2 rounded-full items-center font-bold hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </header>

      <div
        className={`fixed bg-[#6b3333] top-0 left-0 h-full w-64 z-50 transform transition-transform ease-in-out duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Dhana Pathrika</h2>
            <button onClick={toggleSidebar} className="text-white text-2xl">
              &times;
            </button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full mt-4 p-2 rounded bg-gray-100 text-black"
          />
          <ul className="mt-4 space-y-4">
            <Link to="/home" className="block hover:bg-[#a05e5e61] p-2 rounded">
              Home
            </Link>
            <Link
              to="/profile"
              className="block hover:bg-[#a05e5e61] p-2 rounded"
            >
              Profile
            </Link>
            <Link
              to="/payments"
              className="block hover:bg-[#a05e5e61] p-2 rounded"
            >
              Payments
            </Link>
            <Link
              to="/stock-maintenance"
              className="block hover:bg-[#a05e5e61] p-2 rounded"
            >
              Stock Maintenance
            </Link>
            <Link
              to="/bills"
              className="block hover:bg-[#a05e5e61] p-2 rounded"
            >
              Bills
            </Link>
          </ul>
          <button
            className="mt-6 flex items-center text-white"
            onClick={handleLogOut}
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
