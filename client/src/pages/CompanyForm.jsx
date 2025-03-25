import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "../assets/bg.jpg";
import logo from "../assets/logo.jpg";

export default function CompanyForm() {
  const [formData, setFormData] = useState({
    UserName: "",
    CompanyName: "",
    BussinessAdress: "",
    Pincode: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/profile/addProfile`,
        data,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true } // Ensure cookies are sent
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  

  return (
    <div
      className="h-screen flex flex-col items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <motion.div className="flex items-center mb-10" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
        <img src={logo} alt="logo" className="w-12 h-12 mr-3" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-300 to-pink-300">Dhana Pathrika</h1>
      </motion.div>

      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-[600px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-red-600 font-semibold text-lg mb-6 text-center">
          Tell Us Something about you and your company :
        </h2>

        <motion.div className="flex flex-col items-center mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <p className="mt-2">Your Company Logo</p>
          <label className="mt-2 bg-red-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-700">
            Choose File
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <input
            type="text"
            name="CompanyName"
            placeholder="Company Name"
            className="border p-2 rounded-md w-full"
            value={formData.CompanyName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="UserName"
            placeholder="UserName"
            className="border p-2 rounded-md w-full"
            value={formData.UserName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="BussinessAdress"
            placeholder="Company Address"
            className="border p-2 rounded-md w-full col-span-2"
            value={formData.BussinessAdress}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Pincode"
            placeholder="Pin Code"
            className="border p-2 rounded-md w-full"
            value={formData.Pincode}
            onChange={handleChange}
          />
          <div className="flex justify-end col-span-2">
            <motion.button 
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-red-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Submit
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}