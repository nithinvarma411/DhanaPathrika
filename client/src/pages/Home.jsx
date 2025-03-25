import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import Header from "../components/Header";
import StatsSummary from "../components/StatsSummary";
import InvoiceChart from "../components/InvoiceChart";
import RecentActivity from "../components/RecentActivity";
import bgImage from "../assets/bg.jpg";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for all components to mount before setting loading to false
    Promise.all([
      new Promise((resolve) => setTimeout(resolve, 100)), // Simulate data fetching
    ]).then(() => setLoading(false));
  }, []);

  return (
    <div
      className="relative z-0 min-h-screen w-screen text-white bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-red-950/70 relative z-0">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <ClipLoader color="#ffffff" size={50} />
          </div>
        ) : (
          <>
            <Header />
            <StatsSummary />
            <div className="flex flex-wrap mt-8 px-4 gap-4">
              <div className="flex-1 min-w-80">
                <InvoiceChart />
              </div>
              <div className="flex-1 min-w-80">
                <RecentActivity />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
