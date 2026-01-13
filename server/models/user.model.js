import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    profilePic : {
        type : String,
    },
    lastLogin : {
        type : Date,
        default : Date.now()
    },
    descripition : {
        type : String,
        required : true,
        default : "Hey ! i am using Chatify"
    },
    passwordResetToken : String,
    passwordResetTokenExpiresAt : Date,
    verificationToken : String,
    verificationTokenExpiresAt: Date
}, {timestamps : true})

const User = mongoose.model("Users" , userSchema)
export default User;