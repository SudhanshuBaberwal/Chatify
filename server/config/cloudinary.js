import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  try {
    const uploadImage = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return uploadImage.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath)
    console.log("Error in uploadOnCloudinary function", error);
  }
};
export default uploadOnCloudinary;