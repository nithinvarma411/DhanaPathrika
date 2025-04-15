import { Schema, model } from "mongoose";

const userSchema = new Schema({
    UserName: String,
    Email: String,
    MobileNumber: Number,
    Password: String,
    CompanyName: String,
    Logo: String,
    BussinessAdress: String,
    Pincode: Number,
    GoogleId: String,
    FaceDescriptor: {
        type: [Number],
        default: null
    }
},{timestamps: true})

export const User = model("User", userSchema);