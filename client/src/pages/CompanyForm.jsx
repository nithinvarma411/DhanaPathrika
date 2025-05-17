import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "../assets/bg.jpg";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import Chatbot from "../components/Chatbot";

export default function CompanyForm() {
  const [formData, setFormData] = useState({
    UserName: "",
    CompanyName: "",
    BussinessAdress: "",
    Pincode: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/profile/addProfile`,
        data,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/home")
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 relative"
      style={{ backgroundImage: `url(${bg})` }}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent pointer-events-none" />

      <motion.div 
        className="flex items-center mb-10 relative z-10" 
        initial={{ x: -100 }} 
        animate={{ x: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <img src={logo} alt="logo" className="w-16 h-16 mr-4 rounded-full shadow-lg" />
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-400 to-pink-400 drop-shadow-lg">
          Dhana Pathrika
        </h1>
      </motion.div>

      <motion.div
        className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-[650px] relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Tell Us About Your Company
        </h2>

        <motion.div 
          className="flex flex-col items-center mb-8" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-red-200">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl">🏢</span>
            )}
          </div>
          <p className="mt-3 text-gray-600 font-medium">Company Logo</p>
          <label className="mt-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-2 rounded-full cursor-pointer hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-md">
            Upload Logo
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="CompanyName"
                placeholder="Enter company name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                value={formData.CompanyName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="UserName"
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                value={formData.UserName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Business Address</label>
            <input
              type="text"
              name="BussinessAdress"
              placeholder="Enter business address"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
              value={formData.BussinessAdress}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Pin Code</label>
            <input
              type="text"
              name="Pincode"
              placeholder="Enter pin code"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
              value={formData.Pincode}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end pt-4">
            <motion.button 
              type="submit"
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-3 rounded-full shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Details
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
      <Chatbot />
    </div>
  );
}