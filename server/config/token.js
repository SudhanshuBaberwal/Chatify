import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign(
    { userId }, // ✅ MATCHES middleware
    process.env.MYSECRET,
    { expiresIn: "7d" }
  );
  if (!token) {
    return res
      .status(500)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
