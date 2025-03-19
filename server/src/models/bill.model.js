import { Schema, model } from "mongoose";

const billSchema = new Schema({
    BillNumber: String,
    Items: [{
        stockItem: { type: Schema.Types.ObjectId, ref: "Stock" },
        AmountPerItem: Number,
        Quantity: Number
    }]
});

export const Bill = model("Bill", billSchema);
