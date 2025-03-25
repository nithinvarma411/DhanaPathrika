import React from "react";
const InvoiceSummary = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Invoice Summary</h2>
        <div className="flex items-center justify-center">
          <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
            70% Paid
          </div>
        </div>
        <div className="mt-4 flex justify-around">
          <div className="text-green-500">Paid</div>
          <div className="text-red-500">Pending</div>
          <div className="text-blue-500">Invested</div>
        </div>
      </div>
    );
  };
  
  export default InvoiceSummary;
  