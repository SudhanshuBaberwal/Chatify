import express from "express";
import dotenv from "dotenv";
import connectDataBase from "./db/connectDB.js";
import authRouter from "./routes/authRoutes.js";
import Messagerouter from "./routes/messageRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();


// const app = express();
// Now use app from Socker IO


app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 5000;


app.use("/api/auth", authRouter);


app.use("/api/message", Messagerouter);


app.use("/api/user", userRouter);


connectDataBase();
server.listen(port, () => {
  console.log(`Server running on port : ${port}`);
});
