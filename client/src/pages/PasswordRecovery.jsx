// src/pages/PasswordRecovery.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import bg from "../assets/bg.jpg";
import { useNavigate } from "react-router-dom";

const PasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email) return toast.error("Email is required");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/v1/reset/forgotPassword`, {
        Email: email,
      });
      toast.success(res.data.message || "OTP sent");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp) return toast.error("OTP is required");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/v1/reset/verifyotp`, {
        Email: email,
        otp,
      });
      toast.success(res.data.message || "OTP verified");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (!newPassword) return toast.error("Password is required");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/v1/reset/resetpass`, {
        Email: email,
        newPassword,
      });
      toast.success(res.data.message || "Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        {/* Stepper UI */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-between w-full max-w-xs">
            {[1, 2, 3].map((item, index) => (
              <div key={index} className="flex items-center w-full">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                    ${step >= item ? "bg-red-500" : "bg-gray-300"}`}
                >
                  {item}
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-1 mx-1 ${step > item ? "bg-red-500" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-lg font-semibold text-red-500">
            {step === 1 && "Step 1: Enter Email"}
            {step === 2 && "Step 2: Verify OTP"}
            {step === 3 && "Step 3: Reset Password"}
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {/* Step Forms */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
            />
            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordRecovery;
