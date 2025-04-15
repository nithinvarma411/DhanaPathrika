import nodemailer from 'nodemailer';
import { User } from '../models/user.model.js';

const storeOTP = new Map();

const sendotp = async (req, res) => {
    const {Email} = req.body;

    if (!Email) {
        return res.status(400).send({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.NODEMAILER_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MY_EMAIL,
        to: Email,
        subject: "Verify Email Account",
        text: `Your OTP for verification is: ${otp}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        storeOTP.set(Email, otp);
        setTimeout(() => storeOTP.delete(Email), 5 * 60 * 1000); // expire after 5 mins

        return res.status(200).send({ message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).send({ message: "Failed to send OTP", error });
    }
};

const verifyOTP = async (req, res) => {
    const { Email, otp } = req.body;
    // console.log("Received Email:", Email);
    // console.log("Received OTP:", otp);

    if (!Email || !otp) {
        // console.log("Missing Email or OTP");
        return res.status(400).send({ message: "All Fields are Required" });
    }

    const storedOtp = storeOTP.get(Email);
    // console.log("Stored OTP:", storedOtp);

    if (String(otp) === String(storedOtp)) {
        // console.log("OTP verified successfully");
        storeOTP.delete(Email);
        return res.status(200).send({ message: "OTP verified. You can now reset your password." });
    } else {
        console.log("Invalid or expired OTP");
        return res.status(400).send({ message: "Invalid or expired OTP" });
    }
};

export {verifyOTP, sendotp};