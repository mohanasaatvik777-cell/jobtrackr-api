import mongoose from "mongoose";
const userschema = new mongoose.Schema({
    name: {

        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    }
}, { timestamps: true })
export default mongoose.model('User', userschema)