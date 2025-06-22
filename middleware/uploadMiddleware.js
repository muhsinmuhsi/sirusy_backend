import cloudinary from "cloudinary";
import multer from 'multer';
import { config } from "dotenv";

config();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Updated middleware for multiple images
const uploadImage = (req, res, next) => {
  
  upload.array('images')(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: "File upload failed", error });
    }

    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          });
        });

        const imageUrls = await Promise.all(uploadPromises);
        req.cloudinaryImageUrls = imageUrls; // Set array of URLs
        next();
      } catch (err) {
        console.log("cloudinary error:",err);
        console.log("Cloudinary Config:");
        console.log("Name:", process.env.CLOUD_NAME);
        console.log("API Key:", process.env.CLOUD_API_KEY);
        console.log("Secret:", process.env.CLOUD_API_SECRET ? "Exists" : "Missing");
        return res.status(500).json({ message: "Cloudinary upload failed", error: err });
      }
    } else {  
      next();
    }
  });
};

export default uploadImage;
