import express from "express"
import { editProfile, getCurrentUser } from "../controller/user.controller.js";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";

const userRouter = express.Router()

userRouter.get("/current" , isAuth ,  getCurrentUser)
userRouter.put("/profile" , isAuth , upload.single("image") , editProfile)

export default userRouter;