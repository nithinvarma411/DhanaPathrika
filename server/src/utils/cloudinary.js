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

        // Handle both data URL format and raw base64
        const base64Data = base64Image.includes('base64,') 
            ? base64Image.split('base64,')[1] 
            : base64Image;

        // Upload with optimization options
        const response = await cloudinary.uploader.upload(
            `data:image/jpeg;base64,${base64Data}`, 
            {
                resource_type: "image",
                quality: "auto", // Automatic quality optimization
                fetch_format: "auto", // Automatic format optimization
                flags: "lossy", // Allow lossy compression
                transformation: [
                    { quality: "auto:low" }, // Lower quality for large images
                    { fetch_format: "jpg" }, // Convert to JPEG
                    { width: 1500, crop: "limit" } // Limit maximum width
                ]
            }
        );

        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        // Add more specific error information
        if (error.http_code === 413) {
            throw new Error("Image too large");
        }
        throw error;
    }
};

export { uploadOnCloudinary };
