import React from 'react';

const BillingNavTabs = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-4">
        {["Overview", "Unpaid", "Paid"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              selectedTab === tab
                ? "text-green-600 border-green-600"
                : "text-gray-500 hover:text-gray-700 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default BillingNavTabs;
