import React from 'react';
import Header from '../components/Header';
import MoneyFlowChart from '../components/MoneyFlowChart';
import ProfileSection from '../components/ProfileSection';
import bgImage from '../assets/bg.jpg'
import Chatbot from '../components/Chatbot';

const Dashboard = () => {
  return (
    <div
          className="relative z-0 min-h-screen w-screen bg-cover bg-center bg-no-repeat overflow-x-hidden"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
      <Header />
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          <div className="lg:col-span-2">
            <MoneyFlowChart />
          </div>
          <div>
            <ProfileSection />
          </div>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default Dashboard;