import { Schema, model } from "mongoose";

const stockSchema = new Schema({
    ItemName: String,
    CostPrice: Number,
    SellingPrice: Number,
    AvailableQuantity: Number,
    MinQuantity: Number,
    ItemCode: String,
    Group: { type: String, default: null }, // New field for grouping
    user: { type: Schema.Types.ObjectId, ref: "User" } 
},{timestamps:true})

export const Stock = model("Stock", stockSchema);