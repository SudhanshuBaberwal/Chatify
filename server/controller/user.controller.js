import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    // const token = req.cookies?.token;
    // console.log(token)

    // if (!token) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Not Authorized: Token missing",
    //   });
    // }
    // const decoded = jwt.verify(token, process.env.MYSECRET);
    // console.log(decoded)

    const userId = req.id;
    console.log(userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error.message);

    return res.status(401).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    let { name } = req.body;
    let { descripition } = req.body;
    let image;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image Not Provided" });
    }
    image = await uploadOnCloudinary(req.file.path);
    let user = await User.findByIdAndUpdate(req.id, {
      fullname: name,
      image,
      descripition,
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in EditProfiel function : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    let users = await User.find({
      _id: { $ne: req.id },
    }).select("-password");
    // console.log(users)
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error in getother user function : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
