import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import bgImage from "../assets/bg.jpg";
import { useNavigate, Link } from "react-router-dom";
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
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  const validateItemName = (value) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, itemName: "Item name is required" }));
    } else if (value.length < 3) {
      setErrors(prev => ({ ...prev, itemName: "Item name must be at least 3 characters" }));
    } else {
      setErrors(prev => ({ ...prev, itemName: undefined }));
    }
  };

  const validateQuantity = (value, field) => {
    if (!value) {
      setErrors(prev => ({ ...prev, [field]: `${field === 'availableQuantity' ? 'Available' : 'Minimum'} quantity is required` }));
    } else if (value < 0) {
      setErrors(prev => ({ ...prev, [field]: "Quantity cannot be negative" }));
    } else if (field === 'minimumQuantity' && parseInt(value) >= parseInt(availableQuantity)) {
      setErrors(prev => ({ ...prev, minimumQuantity: "Minimum quantity must be less than available quantity" }));
    } else if (field === 'availableQuantity' && parseInt(minimumQuantity) >= parseInt(value)) {
      setErrors(prev => ({ ...prev, availableQuantity: "Available quantity must be greater than minimum quantity" }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validatePrice = (value, field) => {
    if (!value) {
      setErrors(prev => ({ ...prev, [field]: `${field === 'costPrice' ? 'Cost' : 'Selling'} price is required` }));
    } else if (value <= 0) {
      setErrors(prev => ({ ...prev, [field]: "Price must be greater than 0" }));
    } else if (field === 'sellingPrice' && parseFloat(value) <= parseFloat(costPrice)) {
      setErrors(prev => ({ ...prev, sellingPrice: "Selling price must be greater than cost price" }));
    } else {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateItemCode = (value) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, itemCode: "Item code is required" }));
    } else {
      setErrors(prev => ({ ...prev, itemCode: undefined }));
    }
  };

  const handleItemNameChange = (e) => {
    const value = e.target.value;
    setItemName(value);
    validateItemName(value);
  };

  const handleAvailableQuantityChange = (e) => {
    const value = e.target.value;
    setAvailableQuantity(value);
    validateQuantity(value, 'availableQuantity');
    if (minimumQuantity) {
      validateQuantity(minimumQuantity, 'minimumQuantity');
    }
  };

  const handleMinimumQuantityChange = (e) => {
    const value = e.target.value;
    setMinimumQuantity(value);
    validateQuantity(value, 'minimumQuantity');
  };

  const handleCostPriceChange = (e) => {
    const value = e.target.value;
    setCostPrice(value);
    validatePrice(value, 'costPrice');
    if (sellingPrice) {
      validatePrice(sellingPrice, 'sellingPrice');
    }
  };

  const handleSellingPriceChange = (e) => {
    const value = e.target.value;
    setSellingPrice(value);
    validatePrice(value, 'sellingPrice');
  };

  const handleItemCodeChange = (e) => {
    const value = e.target.value;
    setItemCode(value);
    validateItemCode(value);
  };

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

  const validateForm = () => {
    const newErrors = {};
    if (!itemName) newErrors.itemName = "Item name is required";
    if (!availableQuantity) newErrors.availableQuantity = "Available quantity is required";
    if (!minimumQuantity) newErrors.minimumQuantity = "Minimum quantity is required";
    if (!costPrice) newErrors.costPrice = "Cost price is required";
    if (!sellingPrice) newErrors.sellingPrice = "Selling price is required";
    if (parseFloat(sellingPrice) <= parseFloat(costPrice)) {
      newErrors.sellingPrice = "Selling price must be greater than cost price";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
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
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/stock-maintenance");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      setIsLoading(false);
    }
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <Header />
      
      <div className="p-4">

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-red-800 mb-6 border-b pb-2">Add New Stock Item</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <label htmlFor="itemName" className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500">
                Item Name *
              </label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={handleItemNameChange}
                className={`w-full border ${errors.itemName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400`}
              />
              {errors.itemName && <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>}
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
                  onChange={handleAvailableQuantityChange}
                  className={`w-full border ${errors.availableQuantity ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500`}
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
              {errors.availableQuantity && <p className="text-red-500 text-sm mt-1">{errors.availableQuantity}</p>}
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
                onChange={handleMinimumQuantityChange}
                className={`w-full border ${errors.minimumQuantity ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
              {errors.minimumQuantity && <p className="text-red-500 text-sm mt-1">{errors.minimumQuantity}</p>}
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
                onChange={handleItemCodeChange}
                className={`w-full border ${errors.itemCode ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400`}
              />
              {errors.itemCode && <p className="text-red-500 text-sm mt-1">{errors.itemCode}</p>}
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
                  onChange={handleCostPriceChange}
                  className={`w-full border ${errors.costPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.costPrice && <p className="text-red-500 text-sm mt-1">{errors.costPrice}</p>}
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
                  onChange={handleSellingPriceChange}
                  className={`w-full border ${errors.sellingPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.sellingPrice && <p className="text-red-500 text-sm mt-1">{errors.sellingPrice}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/stock-maintenance")}
                className="px-6 py-3 text-red-500 border border-red-500 rounded-full hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 text-white font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${isLoading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
              >
                {isLoading ? "Loading..." : "Add Stock Item"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Stock Addition</h3>
            <p className="mb-4">Are you sure you want to add this stock item?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Chatbot/>
    </div>
  );
};

export default AddStock;
