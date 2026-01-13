import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    let userId = req.userId;
    let user = await User.findById({ userId }).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getCurrentUser function : ", error)
  }
};
