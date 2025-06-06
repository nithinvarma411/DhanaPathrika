import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (base64Image) => {
    try {
        if (!base64Image) {
            return null;
        }

        // Upload directly using base64 string
        const response = await cloudinary.uploader.upload(base64Image, {
            resource_type: "auto"
        });

        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

export { uploadOnCloudinary };
