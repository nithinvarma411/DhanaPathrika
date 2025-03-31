import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActivityItem from "./ActivityItem";

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const toastShown = useRef(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/getInvoices`,
          { withCredentials: true }
        );
        const data = response.data;

        if (response.status === 201) {
          const invoices = data.invoices;
          const formattedActivities = invoices.map((invoice) => {
            const date = new Date(invoice.Date);
            const formattedDate = `${date
              .getDate()
              .toString()
              .padStart(2, "0")}/${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}/${date.getFullYear()}`;

            return {
              avatar: invoice.CustomerName.charAt(0),
              title: `Invoice #${invoice._id} ${
                invoice.AmountPaid ? "Paid" : "Created"
              }`,
              description: invoice.AmountPaid
                ? `${invoice.CustomerName} paid their invoice`
                : `New invoice for ${invoice.CustomerName}`,
              date: formattedDate,
              amount: `$${invoice.AmountPaid.toFixed(2)}`,
              timestamp: date.getTime(), // Store timestamp for sorting
            };
          });

          // Sort by latest date first
          formattedActivities.sort((a, b) => b.timestamp - a.timestamp);

          setActivities(formattedActivities);

          if (!toastShown.current) {
            toast.success(data.message || "Invoices fetched successfully");
            toastShown.current = true;
          }
        } else {
          toast.error(data.message || "Error fetching invoices");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching invoices");
        console.error("Error fetching invoices:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-transparent m-3 backdrop-blur rounded-2xl p-6 outline-3 outline-white">
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-6">
        {activities.length > 0 ? (
          (showAll ? activities : activities.slice(0, 4)).map(
            (activity, index) => (
              <ActivityItem
                key={index}
                avatar={!isMobile ? activity.avatar : null} // Hide avatar on mobile
                title={activity.title}
                description={activity.description}
                date={activity.date}
                amount={activity.amount}
                isMobile={isMobile} // Pass this prop
              />
            )
          )
        ) : (
          <p className="text-gray-500">No recent activity available.</p>
        )}
      </div>
      {activities.length > 4 && !showAll && (
        <div className="flex justify-center mt-4">
          <button
            className="text-[#FFF123] hover:underline"
            onClick={() => navigate("/bills")}
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
