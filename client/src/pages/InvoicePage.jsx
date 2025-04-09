import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Header from "../components/Header";
import Invoice from "../components/Invoice";
import bgImage from "../assets/bg.jpg";
import domtoimage from "dom-to-image";

const InvoicePage = () => {
  const [invoice, setInvoice] = useState(null);
  const [profile, setProfile] = useState(null);
  const invoiceRef = useRef(null);

  const hasFetchedInvoice = useRef(false);
  const hasFetchedProfile = useRef(false);

  useEffect(() => {
    const fetchLatestInvoice = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/invoice/latest-invoice`,
          { withCredentials: true }
        );
        setInvoice(response.data.invoice);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };
  
    if (!hasFetchedInvoice.current) {
      hasFetchedInvoice.current = true;
      fetchLatestInvoice();
    }
  }, []);
  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/profile/getProfile`,
          { withCredentials: true }
        );
        setProfile(response.data.profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    if (!hasFetchedProfile.current) {
      hasFetchedProfile.current = true;
      fetchProfile();
    }
  }, []);
  

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;
  
    try {
      const dataUrl = await domtoimage.toJpeg(invoiceRef.current, { quality: 0.95 });
    
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Invoice_${invoice?._id || "Download"}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error capturing invoice:", error);
    }
  };
  

  return (
    <div className="flex flex-col h-screen" style={{ backgroundImage: `url(${bgImage})` }}>
      <Header />
      <div className="flex-1 overflow-auto p-4">
        <div ref={invoiceRef}>
          <Invoice invoice={invoice} profile={profile} />
        </div>
        <div className="text-center mt-4">
          <button 
            onClick={downloadInvoice} 
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
