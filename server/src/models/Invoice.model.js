import { Schema, model } from "mongoose";

const invoiceSchema = new Schema({
    CustomerName: String,
    CustomerEmail: String,
    Items: [{
        Name: String,
        AmountPerItem: Number,
        Quantity: Number
    }],
    AmountPaid: Number,
    Discount: {
        type: Number,
        default: 0
    },
    DueDate: Date,
    IsDue: {
        type: Boolean,
        default: false
    },
    Date: {
        type: Date,
        default: Date.now()
    },
    PaymentMethod: String,
    user: { type: Schema.Types.ObjectId, ref: "User" }
},{timestamps: true});

export const Invoice = model("Invoice", invoiceSchema);
