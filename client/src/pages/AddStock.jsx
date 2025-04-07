import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import bgImage from "../assets/bg.jpg";
import { useNavigate } from "react-router-dom";

const AddStock = () => {
  const [itemName, setItemName] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [minimumQuantity, setMinimumQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/stock/addStock`,
        {
          ItemName: itemName,
          AvailableQuantity: availableQuantity,
          MinQuantity: minimumQuantity,
          CostPrice: costPrice,
          SellingPrice: sellingPrice,
        },
        {
          withCredentials: true
        }
      );

      toast.success(response.data.message);
      navigate("/stock-maintenance");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <Header />
      
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-red-800 mb-6">New Stock Form :</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="itemName"
                className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500">Item Name</label>
              <input 
                type="text" 
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="availableQuantity" className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500">Available Quantity</label>
              <input 
                type="number" 
                id="availableQuantity"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="minimumQuantity" className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500">Minimum Quantity</label>
              <input 
                type="number" 
                id="minimumQuantity"
                value={minimumQuantity}
                onChange={(e) => setMinimumQuantity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="costPrice" className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500">Cost Price</label>
                <input 
                  type="number" 
                  id="costPrice"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="relative">
                <label htmlFor="sellingPrice" className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500">Selling Price</label>
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
                className="px-6 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStock;
