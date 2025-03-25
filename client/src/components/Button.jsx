import React from 'react';

const Button = ({ children, variant = 'primary', icon, onClick }) => {
  const baseClasses = "px-4 py-2 rounded-full text-white flex items-center justify-center";
  
  const variantClasses = {
    primary: "bg-red-600 hover:bg-red-700",
    secondary: "bg-gray-700 hover:bg-gray-800",
    outline: "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
