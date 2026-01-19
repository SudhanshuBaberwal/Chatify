import express from "express"
import {upload} from "../middleware/multer.js"
import isAuth from "../middleware/isAuth.js"
import { getMessage, sendMessage } from "../controller/message.controller.js"

const Messagerouter = express.Router()
Messagerouter.post("/send/:receiver" , isAuth , upload.single("image") , sendMessage)
Messagerouter.get("/get/:receiver" , isAuth , getMessage)

export default Messagerouter