import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import StatsSummary from "../components/StatsSummary";
import InvoiceChart from "../components/InvoiceChart";
import RecentActivity from "../components/RecentActivity";
import bgImage from "../assets/bg.jpg";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import Chatbot from "../components/Chatbot";
import { motion } from "framer-motion";

const Home = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedOnce = useRef(false);

  useEffect(() => {
    if (hasFetchedOnce.current) return;
    hasFetchedOnce.current = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/getInvoices`,
          { withCredentials: true }
        );

        if (response.status === 201) {
          setInvoices(response.data.invoices);
          toast.success(response.data.message || "Data retrieved successfully");
        } else {
          toast.error(response.data.message || "Error retrieving data");
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="relative z-0 min-h-screen w-screen text-white bg-cover bg-center bg-no-repeat overflow-x-hidden bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="min-h-screen bg-gradient-to-br from-red-950/80 to-red-900/60 backdrop-blur-sm relative z-0">
        <Header />
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-screen"
          >
            <ClipLoader color="white" size={100} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatsSummary invoices={invoices} />
            <div className="flex flex-wrap mt-8 px-4 gap-4">
              <motion.div 
                className="flex-1 min-w-80"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <InvoiceChart invoices={invoices} />
              </motion.div>
              <motion.div 
                className="flex-1 min-w-80"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RecentActivity invoices={invoices} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
      <Chatbot/>
    </div>
  );
};

export default Home;
