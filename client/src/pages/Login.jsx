import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../assets/bg.jpg";
import logoImage from "../assets/logo.jpg";
import mainImage from "../assets/main.jpg";
import googleIcon from "../assets/google.jpg";
import appleIcon from "../assets/apple.png";

const Login = () => {
  const welcomeText = "Welcome to Dhana Pathrika".split(" ");
  const [loading, setLoading] = useState(false);
  const [NumberOrEmail, setNumberOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateInput = () => {
    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!NumberOrEmail || !password) {
      toast.error("All fields are required");
      return false;
    }

    if (!mobileRegex.test(NumberOrEmail) && !emailRegex.test(NumberOrEmail)) {
      toast.error("Enter a valid mobile number or email");
      return false;
    }
    return true;
  };

  const sendResponse = async () => {
    if (!validateInput() || loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        {
          NumberOrEmail,
          Password: password,
        },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Registration successful!");

      setTimeout(() => {
        window.location.href = "/home";
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-center px-4 md:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center z-10">
        <img
          src={logoImage}
          alt="Logo"
          className="w-8 h-8 md:w-10 md:h-10 mr-2"
        />
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-300 to-pink-300 drop-shadow-lg text-lg md:text-3xl font-bold tracking-wide flex items-center">
          {welcomeText.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="mr-1 md:mr-2"
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mt-20 md:mt-28">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex md:w-1/2 items-center justify-center"
        >
          <img
            src={mainImage}
            alt="Illustration"
            className="w-150 h-90 rounded-4xl"
          />
        </motion.div>

        <div className="w-full md:w-2/3 bg-white shadow-lg rounded-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6 text-[#882834] flex justify-center">
            Login To Your Account
          </h1>

          <form className="space-y-6">
            {/* Mobile Number or Email Field */}
            <div className="relative">
              <label
                htmlFor="numberOrEmail"
                className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
              >
                Mobile No. or Email
              </label>
              <input
                type="text"
                id="numberOrEmail"
                value={NumberOrEmail}
                onChange={(e) => setNumberOrEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="absolute left-3 -top-3 bg-white px-1 text-sm text-gray-500"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <motion.button
              type="button"
              onClick={sendResponse}
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className={`w-full py-3 rounded-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              {loading ? "Processing..." : "Login"}
            </motion.button>
          </form>

          <div className="my-4 text-center text-gray-500">OR</div>
          <div className="space-y-3">
            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className="w-full flex items-center justify-center border p-3 rounded-lg hover:bg-gray-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <img
                src={googleIcon}
                alt="Continue with Google"
                className="w-5 h-5 mr-2"
              />
              {loading ? "Processing..." : "Continue with Google"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center border p-3 rounded-lg hover:bg-gray-100 hover:shadow-md"
            >
              <img
                src={appleIcon}
                alt="Continue with Apple"
                className="w-5 h-5 mr-2"
              />
              Continue with Apple
            </motion.button>
          </div>

          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an Account ?{" "}
            <Link to="/" className="text-red-500 font-medium">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
