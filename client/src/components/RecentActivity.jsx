import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ActivityItem from "./ActivityItem";

const RecentActivity = ({ invoices }) => {
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (invoices.length === 0) return;

    const formattedActivities = invoices.map((invoice) => {
      const date = new Date(invoice.Date);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

      return {
        avatar: invoice.CustomerName.charAt(0),
        title: `Invoice #${invoice.InvoiceID || invoice._id} ${invoice.AmountPaid ? "Paid" : "Created"}`,
        description: invoice.AmountPaid
          ? `${invoice.CustomerName} paid their invoice`
          : `New invoice for ${invoice.CustomerName}`,
        date: formattedDate,
        amount: `INR ${invoice.AmountPaid.toFixed(2)}`,
        timestamp: date.getTime(),
      };
    });

    formattedActivities.sort((a, b) => b.timestamp - a.timestamp);
    setActivities(formattedActivities);
  }, [invoices]);

  return (
    <div className="bg-transparent m-3 backdrop-blur rounded-2xl p-6 outline-3 outline-white">
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-6">
        {activities.length > 0 ? (
          (showAll ? activities : activities.slice(0, 4)).map((activity, index) => (
            <ActivityItem
              key={index}
              avatar={!isMobile ? activity.avatar : null}
              title={activity.title}
              description={activity.description}
              date={activity.date}
              amount={activity.amount}
              isMobile={isMobile}
            />
          ))
        ) : (
          <p className="text-gray-500">No recent activity available.</p>
        )}
      </div>
      {activities.length > 4 && !showAll && (
        <div className="flex justify-center mt-4">
          <button className="text-[#FFF123] hover:underline" onClick={() => navigate("/bills")}>
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
