import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const toastShown = useRef(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFaceAuthActive, setIsFaceAuthActive] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/profile/getProfile`,
          { withCredentials: true }
        );
        setProfile(response.data.profile);
        setFormData(response.data.profile);

        if (!toastShown.current) {
          toast.success(response.data.message);
          toastShown.current = true;
        }
      } catch (error) {
        if (!toastShown.current) {
          toast.error(
            error.response?.data?.message || "Error fetching profile"
          );
          toastShown.current = true;
        }
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/profile/updateProfile`,
        formData,
        { withCredentials: true }
      );
      setProfile(formData);
      setIsEditing(false);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
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

  const faceRegister = async () => {
    try {
      // console.log(faceDescriptor);

      const sendFace = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/profile/faceregister`,
        { descriptor: faceDescriptor },
        { withCredentials: true }
      );
      toast.success(sendFace.data.message);
      if (sendFace.status == 200) {
        window.location.href = "/home";
      }
      // console.log(sendFace);
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.error(error);
    }
  };

  const handleFaceAuthClick = () => {
    setIsFaceAuthActive(!isFaceAuthActive);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReadOnlyClick = () => {
    toast.info("Please contact the developer to change this field.");
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg h-screen overflow-y-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-8">Profile</h2>
      
      <div className="flex flex-col items-center mb-8">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-28 h-28 rounded-full flex items-center justify-center mb-4 overflow-hidden shadow-lg">
          {profile && profile.Logo ? (
            <img src={profile.Logo} alt="Profile Logo" className="w-full h-full object-cover" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <p className="text-lg font-semibold text-gray-700">
          {profile ? profile.UserName : "Your Avatar"}
        </p>
      </div>

      {profile ? (
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="CompanyName"
                maxLength={25}
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                value={formData.CompanyName}
                onChange={handleChange}
                readOnly={!isEditing}
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.CompanyName ? formData.CompanyName.length : 0}/25
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">UserName</label>
              <input
                type="text"
                name="UserName"
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                value={formData.UserName}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mobile No.</label>
              <div className="flex">
                <div className="flex items-center border border-gray-200 rounded-l-lg px-3 bg-gray-50">
                  <span>91</span>
                  <span className="ml-1">+</span>
                </div>
                <input
                  type="text"
                  name="MobileNumber"
                  className="w-full border border-gray-200 rounded-r-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  value={formData.MobileNumber}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="Email"
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition cursor-not-allowed"
                value={formData.Email}
                readOnly
                onClick={handleReadOnlyClick}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Business Address</label>
              <input
                type="text"
                name="BussinessAdress"
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                value={formData.BussinessAdress}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                name="Pincode"
                maxLength={6}
                pattern="\d*"
                inputMode="numeric"
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                value={formData.Pincode}
                onChange={e => {
                  // Only allow up to 6 digits, and only numbers
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setFormData({ ...formData, Pincode: val });
                }}
                readOnly={!isEditing}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            {!isEditing ? (
              <button
                type="button"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg"
                onClick={handleEditClick}
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-md hover:shadow-lg"
                onClick={handleSaveClick}
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {profile && profile.FaceDescriptor === null && (
          <button
            onClick={handleFaceAuthClick}
            disabled={loading}
            className="w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg hover:from-red-600 hover:to-red-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "🧑‍💼 Register Face Authentication"}
          </button>
        )}

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
              <button
                type="button"
                onClick={
                  isCameraActive ? captureFaceDescriptor : handleCaptureClick
                }
                className={`w-full py-3 rounded-lg ${
                  isCameraActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {isCameraActive ? "Capture" : "Start Camera"}
              </button>
            )}

            {capturedImage && (
              <button
                type="button"
                onClick={handleCaptureClick}
                className="w-full py-3 mt-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        {isFaceAuthActive && (
          <button
            type="button"
            onClick={faceRegister}
            disabled={loading}
            className={`w-full py-3 rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {loading ? "Verifying..." : "Verify & update"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
