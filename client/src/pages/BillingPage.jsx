import React, { useState } from 'react';
import BillingHeader from '../components/BillingHeader';
import BillingNavTabs from '../components/BillingNavTabs';
import BillingSearchFilter from '../components/BillingSearchFilter';
import BillingTable from '../components/BillingTable';

const BillingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTab, setSelectedTab] = useState("Overview");

  return (
    <div className="container mx-auto px-4 py-6">
      <BillingHeader />
      <BillingNavTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <BillingSearchFilter setSearchQuery={setSearchQuery} setSelectedDate={setSelectedDate} />
      <BillingTable searchQuery={searchQuery} selectedDate={selectedDate} selectedTab={selectedTab} />
    </div>
  );
};

export default BillingPage;
