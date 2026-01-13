import jwt from "jsonwebtoken";

export const generateToken = async (res, id) => {
  try {
    const token = await jwt.sign({ id }, process.env.MYSECRET, {
      expiresIn: "7d",
    });
    if (!token) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid or Expired Token" });
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return token;
  } catch (error) {}
};
