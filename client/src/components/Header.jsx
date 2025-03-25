import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const Header = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
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
        popup: "custom-swal", // Change the background and text color
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
          window.location.href = "/login"; // Redirect to login page
        }, 1000);
      } catch (error) {
        toast.error("Logout failed. Try again.");
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <header className="flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center">
          {/* Hamburger Menu */}
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-gray-600 transition"
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
          <img src={logo} alt="Dhana Pathrika Logo" className="w-10 h-10 mr-2" />
          <h1 className="text-2xl font-bold text-white">Dhana Pathrika</h1>
        </div>
        <div className="flex items-center">
          {/* Notification Icon */}
          <button className="mx-4 p-2 rounded-md hover:bg-gray-200 transition">
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
          </button>
          {/* Logout Button */}
          <button
            onClick={handleLogOut}
            className="hidden sm:flex bg-red-500 text-white px-4 py-2 rounded-full items-center font-bold hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed bg-[#6b3333] top-0 left-0 h-full w-64 bg-maroon z-100 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Dhana Pathrika</h2>
            {/* Close Button */}
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
            <Link to="/home" className="block hover:bg-gray-700 p-2 rounded">Home</Link>
            <Link to="/profile" className="block hover:bg-gray-700 p-2 rounded">Profile</Link>
            <Link to="/payments" className="block hover:bg-gray-700 p-2 rounded">Payments</Link>
            <Link to="/stock-maintenance" className="block hover:bg-gray-700 p-2 rounded">Stock Maintenance</Link>
            <Link to="/bills" className="block hover:bg-gray-700 p-2 rounded">Bills</Link>
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