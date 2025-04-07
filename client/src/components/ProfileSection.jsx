import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileSection = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const toastShown = useRef(false);

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
          toast.error(error.response?.data?.message || "Error fetching profile");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg h-screen overflow-y-auto">
      <h2 className="text-red-600 text-2xl font-semibold mb-6">Profile :</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="bg-gray-200 w-24 h-24 rounded-full flex items-center justify-center mb-2 overflow-hidden">
          {profile && profile.Logo ? (
            <img
              src={profile.Logo}
              alt="Profile Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <p className="text-gray-700 font-medium">
          {profile ? profile.UserName : "Your Avatar"}
        </p>
      </div>
      {profile ? (
        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              name="CompanyName"
              className="w-full border border-gray-300 rounded-lg p-3"
              value={formData.CompanyName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">UserName</label>
            <input
              type="text"
              name="UserName"
              className="w-full border border-gray-300 rounded-lg p-3"
              value={formData.UserName}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Mobile No.</label>
            <div className="flex">
              <div className="flex items-center border border-gray-300 rounded-l-lg px-3 bg-gray-50">
                <span>91</span>
                <span className="ml-1">+</span>
              </div>
              <input
                type="text"
                name="MobileNumber"
                className="w-full border border-gray-300 rounded-r-lg p-3"
                value={formData.MobileNumber}
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="Email"
              className="w-full border border-gray-300 rounded-lg p-3"
              value={formData.Email}
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Business Address</label>
            <input
              type="text"
              name="BussinessAdress"
              className="w-full border border-gray-300 rounded-lg p-3"
              value={formData.BussinessAdress}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              name="Pincode"
              className="w-full border border-gray-300 rounded-lg p-3"
              value={formData.Pincode}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="flex justify-end space-x-4">
            {!isEditing ? (
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleEditClick}
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSaveClick}
              >
                Save
              </button>
            )}
          </div>
        </form>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfileSection;
