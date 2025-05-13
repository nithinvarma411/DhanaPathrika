import { Invoice } from "../models/Invoice.model.js";
import { Stock } from "../models/stock.model.js";
import { User } from "../models/user.model.js";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

const createInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const { CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue, Discount } = req.body;

        if (!CustomerName || !CustomerEmail || !AmountPaid || !PaymentMethod || Items.length === 0) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        if (AmountPaid < 0 || Discount < 0) {
            return res.status(400).send({ "message": "Amount cannot be less than 0" });
        }

        // Calculate total amount of all items
        let totalAmount = 0;
        for (const item of Items) {
            const stockItem = await Stock.findOne({ ItemName: item.Name, user: userId });

            if (!stockItem) {
                return res.status(404).send({ "message": `Stock item '${item.Name}' not found, Please check the spelling it must be exactly same` });
            }

            if (stockItem.AvailableQuantity < item.Quantity) {
                return res.status(400).send({ "message": `Not enough stock for '${item.Name}'` });
            }

            stockItem.AvailableQuantity -= item.Quantity;
            await stockItem.save();

            totalAmount += item.AmountPerItem * item.Quantity;
        }

        // Check if DueDate is required
        if (AmountPaid < totalAmount && !DueDate) {
            return res.status(400).send({ "message": "Due Date is required when full payment is not made" });
        }

        // Create invoice object
        const newInvoice = new Invoice({
            CustomerName,
            CustomerEmail,
            Items,
            AmountPaid,
            Discount,
            DueDate: AmountPaid < totalAmount ? DueDate : undefined, // Only include DueDate if needed
            IsDue: AmountPaid < totalAmount,
            Date,
            PaymentMethod,
            user: userId
        });

        await newInvoice.save();

        return res.status(201).send({ "message": "Invoice created successfully", invoice: newInvoice });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};


const getInvoices = async (req, res) => {
    try {
        const userId = req.user.id
    
        const invoices = await Invoice.find({user: userId});
        
        if (!invoices) {
            return res.status(404).send({"message": "No invoices present"});
        }

        return res.status(201).send({"message": "Invoice retrived successfully", invoices})
        
    } catch (error) {
        console.error("error fetching invoices", error);
        return res.status(500).send({"message": "Internal Server Error"});
    }

}


const updateInvoice = async (req, res) => {
    try {
        let { id } = req.params;
        id = id.replace(":", "");

        // console.log(id);
        
                
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ "message": "Invalid invoice ID" });
        }
        const userId = req.user.id;
        // console.log(userId);
        
        const { CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue, Discount } = req.body;

        // console.log(CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue);
        

        if (!CustomerName || !CustomerEmail || !AmountPaid || !Date || !PaymentMethod || Items.length === 0) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        if (AmountPaid < 0 || Discount < 0) {
            return res.status(400).send({ "message": "Amount and Discount cannot be less than 0" });
        }

        const invoice = await Invoice.findById(id);
        // console.log(invoice);
        
        if (!invoice || invoice.user.toString() !== userId) {
            return res.status(404).send({ "message": "Invoice not found or unauthorized" });
        }

        // Compare old and new items
        const oldItemsMap = new Map(invoice.Items.map(item => [item.Name, item.Quantity]));
        const newItemsMap = new Map(Items.map(item => [item.Name, item.Quantity]));

        // Restore stock for removed or changed items
        for (const [itemName, oldQty] of oldItemsMap.entries()) {
            const newQty = newItemsMap.get(itemName);
            if (newQty === undefined || newQty !== oldQty) {
                await Stock.findOneAndUpdate(
                    { ItemName: itemName, user: userId },
                    { $inc: { AvailableQuantity: oldQty } }
                );
            }
        }

        // Validate and update stock for new or modified items
        for (const [itemName, newQty] of newItemsMap.entries()) {
            const oldQty = oldItemsMap.get(itemName);
            if (oldQty === undefined || newQty !== oldQty) {
                const stockItem = await Stock.findOne({ ItemName: itemName, user: userId });

                if (!stockItem) {
                    return res.status(404).send({ "message": `Stock item '${itemName}' not found` });
                }

                if (stockItem.AvailableQuantity < newQty) {
                    return res.status(400).send({ "message": `Not enough stock for '${itemName}'` });
                }

                await Stock.findOneAndUpdate(
                    { ItemName: itemName, user: userId },
                    { $inc: { AvailableQuantity: -newQty } }
                );
            }
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date, PaymentMethod, IsDue, Discount },
            { new: true }
        );

        return res.status(200).send({ "message": "Invoice updated successfully", invoice: updatedInvoice });
    } catch (error) {
        console.error("Error updating invoice", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const deleteInvoice = async (req, res) => {
    try {
        const {Password} = req.body;
        
        let { id } = req.params;
        id = id.replace(":", "");

        // console.log(id);
        
                
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ "message": "Invalid invoice ID" });
        }
        const userId = req.user.id;
        const user = await User.findById(userId);
        const isPasswordValid = await bcrypt.compare(Password, user.Password)

        if (!isPasswordValid) {
            return res.status(401).send({ "message": "Invalid Password" }); 
        }
        const invoice = await Invoice.findById(id);
        if (!invoice || invoice.user.toString() !== userId) {
            return res.status(404).send({ "message": "Invoice not found or unauthorized" });
        }

        for (const item of invoice.Items) {
            await Stock.findOneAndUpdate(
                { ItemName: item.Name, user: userId },
                { $inc: { AvailableQuantity: item.Quantity } }
            );
        }

        await Invoice.findByIdAndDelete(id);

        return res.status(200).send({ "message": "Invoice deleted successfully" });
    } catch (error) {
        console.error("Error deleting invoice", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};


const getLatestInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const latestInvoice = await Invoice.findOne({ user: userId }).sort({ createdAt: -1 });

        if (!latestInvoice) {
            return res.status(404).send({ "message": "No invoices found" });
        }

        return res.status(200).send({ "message": "Latest invoice retrieved", invoice: latestInvoice });
    } catch (error) {
        console.error("Error fetching latest invoice:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const sendInvoiceEmail = async (req, res) => {
    try {
        const { image, invoiceId } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.Email;
        

        if (!image || !invoiceId) {
            return res.status(400).send({ message: "Image and Invoice ID are required" });
        }

        const invoice = await Invoice.findOne({ _id: invoiceId, user: userId }).populate("user");
        if (!invoice) {
            return res.status(404).send({ message: "Invoice not found" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.NODEMAILER_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: userEmail,
            to: invoice.CustomerEmail,
            subject: `Invoice from ${invoice.user.CompanyName}`,
            html: `<p>Dear ${invoice.CustomerName},</p>
                   <p>Please find your invoice attached below.</p>
                   <p>Thank you for your business!</p>`,
            attachments: [
                {
                    filename: `Invoice_${invoiceId}.jpeg`,
                    content: image.split("base64,")[1],
                    encoding: "base64",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).send({ message: "Invoice sent to email successfully" });
    } catch (error) {
        console.error("Error sending invoice email:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const getMonthlyIncome = async (req, res) => {
    try {
        const userId = req.user.id;

        const invoices = await Invoice.find({ user: userId });

        if (!invoices || invoices.length === 0) {
            return res.status(404).send({ message: "No invoices found" });
        }

        const monthlyIncome = Array(12).fill(0);

        invoices.forEach(invoice => {
            const month = new Date(invoice.Date).getMonth();
            monthlyIncome[month] += invoice.AmountPaid;
        });

        return res.status(200).send({ message: "Monthly income retrieved", data: monthlyIncome });
    } catch (error) {
        console.error("Error fetching monthly income:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

export { createInvoice, getInvoices, updateInvoice, deleteInvoice, getLatestInvoice, sendInvoiceEmail, getMonthlyIncome };