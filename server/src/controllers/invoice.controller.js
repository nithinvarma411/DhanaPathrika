import { Invoice } from "../models/Invoice.model.js";
import { Stock } from "../models/stock.model.js";
import { User } from "../models/user.model.js";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";

const generateInvoiceID = async (customerName, invoiceDate, userId) => {
    const namePart = customerName.substring(0, 4).toUpperCase();
    const formattedDate = new Date(invoiceDate);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear().toString().slice(-2);
    const datePart = `${day}${month}${year}`;

    // Count invoices for this customer on this date
    const startOfDay = new Date(formattedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(formattedDate.setHours(23, 59, 59, 999));
    
    const customerDailyInvoiceCount = await Invoice.countDocuments({
        user: userId,
        CustomerName: customerName,
        Date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    return `${namePart}${datePart}-${(customerDailyInvoiceCount + 1).toString().padStart(2, '0')}`;
};

const createInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const { CustomerName, CustomerEmail, Items, AmountPaid, DueDate, Date: invoiceDate, PaymentMethod, IsDue, Discount } = req.body;

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

        if (Discount > totalAmount) {
            return res.status(400).send({ "message": "Discount cannot be more than total amount" });
        }
        // Check if DueDate is required
        if (AmountPaid < totalAmount && !DueDate) {
            return res.status(400).send({ "message": "Due Date is required when full payment is not made" });
        }

        // Generate InvoiceID
        const currentDate = invoiceDate ? new Date(invoiceDate) : new Date();
        const InvoiceID = await generateInvoiceID(CustomerName, currentDate, userId);

        // Create invoice object
        const newInvoice = new Invoice({
            InvoiceID,
            CustomerName,
            CustomerEmail,
            Items,
            AmountPaid,
            Discount,
            DueDate: AmountPaid < totalAmount ? DueDate : undefined, // Only include DueDate if needed
            IsDue: AmountPaid < totalAmount,
            Date: currentDate,
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
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ "message": "Invalid invoice ID" });
        }
        const userId = req.user.id;
        
        const { 
            CustomerName, 
            CustomerEmail, 
            Items, 
            AmountPaid, 
            DueDate, 
            Date: invoiceDate,
            PaymentMethod, 
            IsDue, 
            Discount, 
            _deletedItems 
        } = req.body;

        if (!CustomerName || !CustomerEmail || !AmountPaid || !invoiceDate || !PaymentMethod || Items.length === 0) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        const oldInvoice = await Invoice.findById(id);
        if (!oldInvoice || oldInvoice.user.toString() !== userId) {
            return res.status(404).send({ "message": "Invoice not found or unauthorized" });
        }

        // First, restore stock quantities for deleted items
        if (_deletedItems?.length > 0) {
            for (const deletedItem of _deletedItems) {
                const stockItem = await Stock.findOne({ ItemName: deletedItem.Name, user: userId });
                if (stockItem) {
                    stockItem.AvailableQuantity += deletedItem.Quantity;
                    await stockItem.save();
                }
            }
        }

        // Handle stock updates for remaining and modified items
        const stockUpdates = [];
        
        // Create maps for easier comparison
        const oldItemsMap = new Map(oldInvoice.Items.map(item => [item.Name, item]));
        const newItemsMap = new Map(Items.map(item => [item.Name, item]));

        // Handle items that were in old invoice but not in new one (removed items)
        for (const [itemName, oldItem] of oldItemsMap) {
            if (!newItemsMap.has(itemName)) {
                const stockItem = await Stock.findOne({ ItemName: itemName, user: userId });
                if (stockItem) {
                    stockItem.AvailableQuantity += oldItem.Quantity; // Return stock
                    await stockItem.save();
                    stockUpdates.push({
                        item: itemName,
                        change: oldItem.Quantity,
                        type: 'removed'
                    });
                }
            }
        }

        // Handle new and modified items
        for (const [itemName, newItem] of newItemsMap) {
            const oldItem = oldItemsMap.get(itemName);
            const stockItem = await Stock.findOne({ ItemName: itemName, user: userId });
            
            if (!stockItem) {
                return res.status(404).send({ "message": `Stock item '${itemName}' not found` });
            }

            let quantityDiff = 0;
            if (!oldItem) {
                // New item added to invoice
                quantityDiff = newItem.Quantity;
            } else {
                // Existing item with possibly modified quantity
                quantityDiff = newItem.Quantity - oldItem.Quantity;
            }

            if (quantityDiff > 0 && stockItem.AvailableQuantity < quantityDiff) {
                return res.status(400).send({
                    "message": `Not enough stock for '${itemName}'`,
                    "available": stockItem.AvailableQuantity,
                    "required": quantityDiff
                });
            }

            stockItem.AvailableQuantity -= quantityDiff;
            await stockItem.save();
            
            stockUpdates.push({
                item: itemName,
                change: -quantityDiff,
                type: oldItem ? 'modified' : 'added'
            });
        }

        // Calculate total amount after all item changes
        const totalAmount = Items.reduce((sum, item) => sum + (item.Quantity * item.AmountPerItem), 0);
        
        // Calculate final balance after discount
        const balanceAfterDiscount = totalAmount - AmountPaid - (Discount || 0);
        
        // Determine IsDue status based on balance
        const newIsDue = balanceAfterDiscount > 0;

        // If there's a new balance but no due date, require one
        if (newIsDue && !DueDate) {
            return res.status(400).send({ 
                "message": "Due Date is required when there is a remaining balance" 
            });
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            id,
            { 
                CustomerName, 
                CustomerEmail, 
                Items, 
                AmountPaid, 
                DueDate: newIsDue ? DueDate : null, // Clear due date if fully paid
                Date: invoiceDate, // Use renamed variable
                PaymentMethod, 
                IsDue: newIsDue, // Set based on calculation
                Discount,
                lastModified: new Date(),
                modificationHistory: [
                    ...(oldInvoice.modificationHistory || []),
                    {
                        timestamp: new Date(),
                        userId: userId,
                        stockUpdates,
                        balanceChange: {
                            oldBalance: oldInvoice.AmountPaid - oldInvoice.Discount,
                            newBalance: AmountPaid - Discount,
                            totalAmount
                        }
                    }
                ]
            },
            { new: true }
        );

        return res.status(200).send({ 
            "message": "Invoice updated successfully", 
            invoice: updatedInvoice,
            stockUpdates
        });
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
        // console.log({image, invoiceId});
        
        const userId = req.user.id;
        const userEmail = req.user.Email;
        

        if (!image || !invoiceId) {
            return res.status(400).send({ message: "Image and Invoice ID are required" });
        }

        const invoice = await Invoice.findOne({ InvoiceID: invoiceId, user: userId }).populate("user");
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