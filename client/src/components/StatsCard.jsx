import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, change, isPositive }) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,       // Slight zoom effect
        y: -3,           // Moves the card upward
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Adds depth
      }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }} // Smooth transition
      className="bg-[#5e2e2e] backdrop-blur rounded-lg p-4 flex-1 min-w-64"
    >
      <h2 className="text-xl">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <div className={`flex items-center mt-2 ${isPositive ? 'text-green-400' : 'text-[#d80f0f]'}`}>
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
        <span>{change}% vs last month</span>
      </div>
    </motion.div>
  );
};

export default StatsCard;
