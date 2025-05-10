import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, change, isPositive }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -5,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-[#5e2e2e] to-[#7a3e3e] backdrop-blur-md rounded-xl p-6 flex-1 min-w-64 shadow-lg border border-red-800/20"
    >
      <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
      <motion.p 
        className="text-4xl font-bold mt-3 text-white"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {value}
      </motion.p>
      <motion.div 
        className={`flex items-center mt-3 ${isPositive ? 'text-green-400' : 'text-[#ff4444]'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d={isPositive 
              ? "M5 10l7-7m0 0l7 7m-7-7v18" 
              : "M19 14l-7 7m0 0l-7-7m7 7V3"}
          ></path>
        </svg>
        <span className="font-medium">{change}% vs last month</span>
      </motion.div>
    </motion.div>
  );
};

export default StatsCard;
