import mongoose from "mongoose";

const conversationsSchema = new mongoose.Schema({
    participants : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Users"
        }
    ],
    messages : [
        {type : String}
    ],
} , {timestamps : true})

const Conversation = mongoose.model("Conversation" , conversationsSchema)

export default Conversation;