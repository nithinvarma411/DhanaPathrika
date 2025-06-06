import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import bgImage from '../assets/bg.jpg'
import axios from "axios";

const ProfileCheck = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/profile/getProfile`,
          { withCredentials: true }
        );

        if (!response.data.isProfileComplete) {
          navigate("/details");
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Profile check failed:", error);
        navigate("/login");
      }
    };

    checkProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div
        className="relative z-0 min-h-screen w-screen text-white bg-cover bg-center bg-no-repeat overflow-x-hidden bg-fixed"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-screen"
        >
          <ClipLoader color="white" size={100} />
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProfileCheck;
