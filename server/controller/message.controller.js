import Conversation from "../models/conversation.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const sender = req.id;
    const receiver = req.params.receiver;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        message: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    const receiverSocketId = getReceiverSocketId(receiver)
    if (receiverSocketId){
      io.to(receiverSocketId).emit("newMessage" , newMessage)
    }

    return res.status(200).json({ success: true }, newMessage);
  } catch (error) {
    console.log("Error in sendMessage Function : ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;              // logged-in user
    const receiverId = req.params.receiver;     // selected user
    // console.log(senderId)
    // console.log(receiverId)

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: []   // ✅ VERY IMPORTANT
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages // ✅ SEND ARRAY
    });

  } catch (error) {
    console.log("getMessages error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
