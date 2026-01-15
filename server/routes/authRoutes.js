import express from "express"
import { forgotPassword, login, logout, signup, verifyEmail } from "../controller/auth.controller.js";

const authRouter = express.Router()

authRouter.post("/signup" , signup)
authRouter.post("/login" , login)
authRouter.post("/verifyEmail" , verifyEmail)
authRouter.post("/forgot-password" , forgotPassword)
authRouter.get("/logout" , logout)

export default authRouter;