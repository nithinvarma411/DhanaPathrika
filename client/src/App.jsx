import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CompanyForm from "./pages/CompanyForm";
import Dashboard from "./pages/Dashboard";
import InvoicePage from "./pages/InvoicePage";
import BillingPage from "./pages/BillingPage";
import InvoiceGenerator from "./pages/InvoiceGenerator";
import StockMaintainance from "./pages/StockMaintainance";
import AddStock from "./pages/AddStock";
import NotFound from "./pages/NotFound";
import StampTemplate from "./pages/StampTemplate";
import Notification from "./pages/Notification";
import LandingPage from "./pages/LandingPage";
import PasswordRecovery from "./pages/PasswordRecovery";
import ProfileCheck from "./components/ProfileCheck";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/details" element={<CompanyForm />} />
        <Route path="/password-recovery" element={<PasswordRecovery />} />

        {/* Protected Routes with Profile Check */}
        <Route path="/home" element={<ProfileCheck><Home /></ProfileCheck>} />
        <Route path="/profile" element={<ProfileCheck><Dashboard /></ProfileCheck>} />
        <Route path="/Bills" element={<ProfileCheck><BillingPage /></ProfileCheck>} />
        <Route path="/invoice-generator" element={<ProfileCheck><InvoiceGenerator /></ProfileCheck>} />
        <Route path="/invoice" element={<ProfileCheck><InvoicePage /></ProfileCheck>} />
        <Route path="/stock-maintenance" element={<ProfileCheck><StockMaintainance /></ProfileCheck>} />
        <Route path="/notification" element={<ProfileCheck><Notification /></ProfileCheck>} />
        <Route path="/add-stock" element={<ProfileCheck><AddStock /></ProfileCheck>} />
        <Route path="/stamp-templates" element={<ProfileCheck><StampTemplate /></ProfileCheck>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
