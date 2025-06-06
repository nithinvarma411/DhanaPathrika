import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import bgImage from "../assets/bg.jpg";
import logoImage from "../assets/logo.jpg";
import mainImage from "../assets/main.jpg";
import googleIcon from "../assets/google.jpg";
import * as faceapi from "face-api.js";
import Chatbot from "../components/Chatbot";

const Login = () => {
  const welcomeText = "Welcome to Dhana Pathrika".split(" ");
  const [loading, setLoading] = useState(false);
  const [NumberOrEmail, setNumberOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFaceAuthActive, setIsFaceAuthActive] = useState(false);

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
        `${import.meta.env.VITE_BACKEND_URL}api/v1/user/login`,
        {
          NumberOrEmail,
          Password: password,
        },
        { withCredentials: true }
      );

      toast.success(response.data.message || "Registration successful!");
      window.location.href = "/home";
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

  const startCamera = async () => {
      try {
        const video = document.getElementById("videoElement");
        if (!video.srcObject) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          video.srcObject = stream;
          await video.play();
          // console.log("Camera started.");
        }
      } catch (error) {
        console.error("Error starting camera:", error);
        toast.error(
          "Failed to access the camera. Please check your permissions."
        );
      }
    };
  
    const handleCaptureClick = async () => {
      const video = document.getElementById("videoElement");
  
      if (isCameraActive) {
        // Cancel capture
        setIsCameraActive(false);
        setCapturedImage(null);
        const stream = video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          video.srcObject = null;
        }
        // console.log("Camera stopped.");
      } else if (!capturedImage) {
        // Start camera if no image is captured
        setIsCameraActive(true);
        await startCamera();
      }
    };
  
    const captureFaceDescriptor = async () => {
      try {
        const video = document.getElementById("videoElement");
        const canvas = document.getElementById("canvasElement");
  
        if (!video || !canvas) {
          toast.error("Video or canvas element not found.");
          return;
        }
  
        // Ensure face-api models are loaded
        try {
          await Promise.all([
            faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          ]);
          // console.log("Face-api models loaded successfully.");
        } catch (modelError) {
          console.error("Error loading face-api models:", modelError);
          toast.error("Failed to load face detection models. Please try again.");
          return;
        }
  
        // Draw the current frame from the video onto the canvas
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        // Save the captured image
        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
  
        // Stop the camera after capturing
        const stream = video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
          video.srcObject = null;
        }
        setIsCameraActive(false);
  
        // Detect face and landmarks
        const detections = await faceapi
          .detectSingleFace(canvas)
          .withFaceLandmarks()
          .withFaceDescriptor();
  
        // console.log("Detections:", detections);
  
        if (detections && detections.descriptor) {
          setFaceDescriptor(detections.descriptor);
          // console.log("Face descriptor captured:", detections.descriptor);
          toast.success("Face captured successfully!");
        } else {
          // console.error("No face detected or descriptor is null.");
          toast.error("No face detected. Please try again.");
        }
      } catch (error) {
        console.error("Error capturing face descriptor:", error);
        toast.error("Failed to capture face. Please try again.");
      }
    };

    const faceLogin = async () => {
      try {
        // console.log(faceDescriptor);
        
        const sendFace = await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/v1/user/facelogin`, {descriptor: faceDescriptor}, {withCredentials: true});
        toast.success(sendFace.data.message);
        if (sendFace.status == 200) {
          window.location.href = "/home";
        }
        // console.log(sendFace);
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.error(error);
      }
    }

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}auth/google`;
  };

  const handleFaceAuthClick = () => {
    setIsFaceAuthActive(true);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-center px-4 md:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Updated Back Button with background */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-white flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 backdrop-blur-sm hover:bg-red-500/50 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>Back</span>
      </Link>

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

            <div className="text-right text-sm text-blue-600 hover:underline cursor-pointer">
              <Link to="/password-recovery">Forgot Password?</Link>
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
              onClick={handleFaceAuthClick}
              disabled={loading}
              whileHover={!loading ? { scale: 1.05 } : {}}
              whileTap={!loading ? { scale: 0.95 } : {}}
              className="w-full flex items-center justify-center border p-3 rounded-lg hover:bg-gray-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "🧑‍💼 Face Authenticate"}
            </motion.button>

            {isFaceAuthActive && (
              <div className="relative">
                <label className="block text-sm text-gray-500 mb-2">
                  Capture Face
                </label>
                {capturedImage ? (
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-48 h-48 border rounded-lg mb-4"
                  />
                ) : (
                  <video
                    id="videoElement"
                    autoPlay
                    muted
                    className="w-48 h-48 border rounded-lg mb-4"
                  ></video>
                )}
                <canvas id="canvasElement" className="hidden"></canvas>
                {!capturedImage && (
                  <motion.button
                    type="button"
                    onClick={
                      isCameraActive
                        ? captureFaceDescriptor
                        : handleCaptureClick
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg ${
                      isCameraActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    {isCameraActive ? "Capture" : "Start Camera"}
                  </motion.button>
                )}
                {capturedImage && (
                  <motion.button
                    type="button"
                    onClick={handleCaptureClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 mt-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            )}

            {isFaceAuthActive && (
              <motion.button
                type="button"
                onClick={faceLogin}
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className={`w-full py-3 rounded-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white`}
              >
                {loading ? "Verifying..." : "Verify & Register"}
              </motion.button>
            )}
          </div>

          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an Account ?{" "}
            <Link to="/signup" className="text-red-500 font-medium">
              Register Here
            </Link>
          </p>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
};

export default Login;
