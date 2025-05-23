import cloudinary from 'cloudinary'
import multer from 'multer'

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 2000000000 }, // 2GB
});



const uploadBanner = (req, res, next) => {
    
    upload.single('image')(req, res, (error) => {
        if (error) {
            return res.status(400).json({ message: "File upload failed", error });
        }

        if (req.file) {
            // Upload the image to Cloudinary using the file buffer
            const stream = cloudinary.v2.uploader.upload_stream(
                { resource_type: "image" },
                (error, result ) => {
                    if (error) {
                        return res.status(500).json({ message: "Cloudinary upload failed", error });
                    }

                    // Add the Cloudinary image URL to the request object
                    req.cloudinaryImageUrl = result.secure_url;
                    next();
                }
            );

            // Write the buffer data to the upload stream
            stream.end(req.file.buffer);
        } else {
            next()
        }
    });
};

export default uploadBanner;