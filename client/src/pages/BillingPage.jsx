import React, { useState } from 'react';
import BillingHeader from '../components/BillingHeader';
import BillingNavTabs from '../components/BillingNavTabs';
import BillingSearchFilter from '../components/BillingSearchFilter';
import BillingTable from '../components/BillingTable';
import Chatbot from '../components/Chatbot';

const BillingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [monthFilter, setMonthFilter] = useState("This Month");

  return (
    <div className="container mx-auto px-4 py-6">
      <BillingHeader />
      <BillingNavTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <BillingSearchFilter 
        setSearchQuery={setSearchQuery} 
        setSelectedDate={setSelectedDate}
        setMonthFilter={setMonthFilter} 
      />
      <BillingTable 
        searchQuery={searchQuery} 
        selectedDate={selectedDate} 
        selectedTab={selectedTab}
        monthFilter={monthFilter}
        setMonthFilter={setMonthFilter}
      />
      <Chatbot/>
    </div>
  );
};

export default BillingPage;
