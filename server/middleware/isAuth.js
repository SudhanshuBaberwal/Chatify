import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Token not provided",
        });
    }
    let verifyToken = await jwt.verify(token , process.env.MYSECRET)
    if (!verifyToken?.userId){
        return res.status(400).json({
            success: false,
            message : "Not Authorized"
        })
    }
    // console.log(verifyToken.userId)
    req.id = verifyToken.userId;
    next();
  } catch (error) {
    console.log("Error in Auth function : ", error);
    return res.status(500).json({success : false, message : error.message})
  }
};

export default isAuth;