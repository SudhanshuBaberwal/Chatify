import mongoose from "mongoose";

const connectDataBase = () => {
    try {
        const uri = process.env.MONGODB_URI;
        mongoose.connect(uri)
        console.log("DB connected Successfully")
    } catch (error) {
        console.log("Error in ConnectDB : ", error)
    }
}
export default connectDataBase;