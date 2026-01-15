import { generateToken } from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateVerificationCode from "../utils/GenerateCode.js";
import { passwordResetEmail, verificationEmail } from "../emails/email.js";
import crypto from "crypto"

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const checkUserByUserName = await User.findOne({ fullname });
    const Existeduser = await User.findOne({ email });
    if (checkUserByUserName) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist by Username" });
    }
    if (Existeduser) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Exist by email" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be atleast 6 charracters",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateVerificationCode();
    const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      verificationToken: code,
      verificationTokenExpiresAt: verificationTokenExpiresAt,
    });

    await user.save();

    // generate cookie
    await generateToken(res, user._id);

    // send verification email with code
    await verificationEmail(email, code);

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in signup function : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All files are required",
      });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User Does Not Exist",
      });
    }
    const pass = await bcrypt.compare(password, userExist.password);
    if (!pass) {
      return res.status(400).json({
        success: false,
        message: "Email or Password are incorrect",
      });
    }
    generateToken(res, userExist._id);
    userExist.lastLogin = Date.now();
    await userExist.save();

    return res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      user: {
        ...userExist._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login function : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.log("Error in logout function : ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { verificationCode } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Verification Code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    return res.status(200).json({
      success: true,
      message: "User Verified Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in  verifyEmail function : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req , res) => {
  const {email} = req.body;
  try {
    if (!email){
      return res.status(400).json({success : false , message : "All fields are required"})
    }
    console.log(email)
    const user = await User.findOne({email})
    console.log(user)
    if (!user){
      return res.status(400).json({success : false , message : "User Not Found"})
    }

    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    const resetToken = crypto.randomBytes(16).toString("hex");

    user.passwordResetTokenExpiresAt = resetPasswordExpiresAt,
    user.passwordResetToken = resetToken;
    await user.save()

    // send email for reset password

    const emailURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    await passwordResetEmail(emailURL , email);

    return res.status(200).json({success : true , message : "Password Reset Email Sent Successfully"})

  } catch (error) {
    console.log("Error in forgotPassword Function : ", error)
    return res.status(500).json({success : false , message : error.message})
  }
}