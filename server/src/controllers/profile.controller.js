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

        const isProfileComplete = !!(
            userProfile.Pincode && 
            userProfile.BussinessAdress && 
            userProfile.CompanyName && 
            userProfile.UserName
        );

        return res.status(200).send({ 
            "message": "User profile retrieved successfully", 
            profile: userProfile,
            isProfileComplete
        });
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

// Helper function to calculate Euclidean distance
function euclideanDistance(arr1, arr2) {
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        sum += Math.pow(arr1[i] - arr2[i], 2);
    }
    return Math.sqrt(sum);
}

const faceRegister = async (req, res) => {
    try {
        const userId = req.user.id;
        let { descriptor } = req.body; // Might be array, stringified array, or object

        // console.log("Received descriptor:", descriptor);

        // Parse descriptor if needed
        if (typeof descriptor === 'string') {
            try {
                descriptor = JSON.parse(descriptor);
            } catch (error) {
                return res.status(400).send({ message: "Invalid FaceDescriptor format" });
            }
        }

        if (typeof descriptor === 'object' && !Array.isArray(descriptor)) {
            descriptor = Object.values(descriptor);
        }

        if (
            !descriptor ||
            !Array.isArray(descriptor) ||
            descriptor.length !== 128 ||
            !descriptor.every(item => typeof item === 'number' && isFinite(item))
        ) {
            return res.status(400).send({ message: "Face descriptor missing, invalid, or incorrect format" });
        }

        // Find all users with FaceDescriptor
        const users = await User.find({ FaceDescriptor: { $ne: null } });

        for (const user of users) {
            if (!Array.isArray(user.FaceDescriptor) || user.FaceDescriptor.length !== 128) continue;

            const distance = euclideanDistance(descriptor, user.FaceDescriptor);

            if (distance < 0.5) {
                return res.status(409).send({ message: "Face already registered with another account" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {FaceDescriptor: descriptor}, {new: true});

        if (!updatedUser) {
            return res.status(404).send({ "message": "User not found" });
        }

        return res.status(200).send({ "message": "face registered successfully", user: updatedUser });
    } catch (error) {
        console.error("Error Registering Face", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
}

export { addProfile, getProfile, updateProfile, faceRegister };
