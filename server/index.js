import express from "express";
import dotenv from "dotenv";
import connectDataBase from "./db/connectDB.js";
import authRouter from "./routes/authRoutes.js";
import Messagerouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;

// auth Routes
app.use("/api/auth", authRouter);

// message Routes
app.use("/api/message", Messagerouter);

// user Routes
app.use("/api/user", userRouter);

// connectDB
connectDataBase();
app.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
