import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import bgImage from "../assets/bg.jpg";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";

const AddStock = () => {
  const [itemName, setItemName] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [minimumQuantity, setMinimumQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const getCostPriceLabel = () => {
    if (unit === "pcs") {
        return "Cost Price (per piece)";
    } else if (unit === "kg") {
        return "Cost Price (per kilogram)";
    } else if (unit === "L") {
        return "Cost Price (per litre)";
    } else {
        return "Cost Price";
    }
  };

  const getSellingPriceLabel = () => {
    if (unit === "pcs") {
        return "Selling Price (per piece)";
    } else if (unit === "kg") {
        return "Selling Price (per kilogram)";
    } else if (unit === "L") {
        return "Selling Price (per litre)";
    } else {
        return "Selling Price";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/addStock`,
        {
          ItemName: itemName,
          AvailableQuantity: availableQuantity,
          MinQuantity: minimumQuantity,
          CostPrice: costPrice,
          SellingPrice: sellingPrice,
          ItemCode: itemCode,
          Unit: unit
        },
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      navigate("/stock-maintenance");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      setIsLoading(false); // 🔁 Stop loading on error
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Header />

      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-red-800 mb-6">
            New Stock Form :
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="itemName"
                className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
              >
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="availableQuantity"
                className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
              >
                Available Quantity
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="availableQuantity"
                  value={availableQuantity}
                  onChange={(e) => setAvailableQuantity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="ml-2 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="L">Liters</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="minimumQuantity"
                className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
              >
                Minimum Quantity
              </label>
              <input
                type="number"
                id="minimumQuantity"
                value={minimumQuantity}
                onChange={(e) => setMinimumQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="itemCode"
                className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
              >
                Item Code
              </label>
              <input
                type="text"
                id="itemCode"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="costPrice"
                  className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
                >
                  {getCostPriceLabel()}
                </label>
                <input
                  type="number"
                  id="costPrice"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="sellingPrice"
                  className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
                >
                  {getSellingPriceLabel()}
                </label>
                <input
                  type="number"
                  id="sellingPrice"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default AddStock;
