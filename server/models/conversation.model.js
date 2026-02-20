import mongoose from "mongoose";

const conversationsSchema = new mongoose.Schema({
    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Users"
        }
    ],
    messages : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Message"
        }
    ],
} , {timestamps : true})

const Conversation = mongoose.model("Conversation" , conversationsSchema)

export default Conversation;