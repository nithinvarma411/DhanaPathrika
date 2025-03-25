import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { UserName, CompanyName, BussinessAdress, Pincode } = req.body;

        if (!UserName || !CompanyName || !BussinessAdress || !Pincode) {
            return res.status(400).send({ "message": "All fields are required" });
        }

        let logoUrl = null;

        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (!cloudinaryResponse) {
                return res.status(500).send({ "message": "Error uploading logo" });
            }
            logoUrl = cloudinaryResponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { UserName, CompanyName, BussinessAdress, Pincode, Logo: logoUrl },
            { new: true }
        );

        return res.status(200).send({ "message": "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const userProfile = await User.findById(userId);

        if (!userProfile) {
            return res.status(404).send({ "message": "User not found" });
        }

        return res.status(200).send({ "message": "User profile retrived successfully", profile: userProfile });
    } catch (error) {
        console.error("Error retrieving user data", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { UserName, Email, Password, MobileNumber, BussinessAdress, CompanyName, Pincode } = req.body;

        if (!UserName || !Email || !Password || !MobileNumber || !BussinessAdress || !CompanyName || !Pincode) {
            return res.status(400).send({ "message": "All fields are required" });
        }

        let logoUrl = null;

        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            if (!cloudinaryResponse) {
                return res.status(500).send({ "message": "Error uploading logo" });
            }
            logoUrl = cloudinaryResponse.secure_url;
        }

        const updatedData = { UserName, Email, Password, MobileNumber, BussinessAdress, CompanyName, Pincode };
        if (logoUrl) {
            updatedData.Logo = logoUrl
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).send({ "message": "User not found" });
        }

        return res.status(200).send({ "message": "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

export { addProfile, getProfile, updateProfile };
