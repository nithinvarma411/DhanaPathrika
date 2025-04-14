import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const BillingHeader = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
        popup: "custom-swal",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/user/logout`,
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
    <div className="flex justify-between items-center p-4 bg-white shadow-gray-400 shadow-lg w-full">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md focus:outline-none md:hidden lg:block hover:bg-gray-200"
        >
          <svg
            className="w-8 h-8 text-black"
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
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-gray-800">Billing</h1>
          <p className="text-gray-500 text-sm">
            Manage your billing and payment details
          </p>
        </div>
      </div>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        onClick={() => navigate("/invoice-generator")}
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add
      </button>

      {/* Sidebar */}
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
            <Link
              to="/notification"
              className="block hover:bg-[#a05e5e61] p-2 rounded"
            >
              Notification
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

export default BillingHeader;
