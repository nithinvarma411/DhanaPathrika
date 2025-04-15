import React, { useState } from "react";

const BillingSearchFilter = ({ setSearchQuery, setSelectedDate }) => {
  const [date, setDate] = useState("");

  const handleDateChange = (e) => {
    setDate(e.target.value);
    setSelectedDate(e.target.value);
  };

  const clearDateFilter = () => {
    setDate("");
    setSelectedDate("");
  };

  return (
    <div className="relative mt-4 mb-4 flex items-center gap-4">
      {/* Search Bar */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search by invoice number, name"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Date Filter with Clear Button */}
      <div className="relative flex items-center gap-2">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {date && (
          <button
            onClick={clearDateFilter}
            className="px-2 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default BillingSearchFilter;
