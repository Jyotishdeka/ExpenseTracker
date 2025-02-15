import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    ///upload the file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file uploaded", uploadResult);
    fs.unlinkSync(localFilePath)
    return uploadResult;

  } catch (error) {
    fs.unlinkSync(localFilePath); // removed localy saved temporary file as the upload operation got faild
    return null;
  }
};

export { uploadOnCloudinary };
