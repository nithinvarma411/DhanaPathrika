import nodemailer from 'nodemailer';
import { User } from '../models/user.model.js';
import bcrypt from 'bcrypt';

const storeOTP = new Map();

const forgotPassword = async (req, res) => {
    const {Email} = req.body;

    const user = await User.findOne({ Email });

    if (!user) {
        return res.status(400).send({ message: "No registered User found by this Email" });
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
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is: ${otp}`,
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
    const {Email, otp} = req.body;

    if (!Email || !otp) {
        return res.status(400).send({ message: "All Fields are Required" });
    }

    const storedOtp = storeOTP.get(Email);

    if (String(otp) === String(storedOtp)) {
        storeOTP.delete(Email); // remove used OTP
        return res.status(200).send({ message: "OTP verified. You can now reset your password." });
    } else {
        return res.status(400).send({ message: "Invalid or expired OTP" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const {Email, newPassword} = req.body;

        if (!Email || !newPassword) {
            return res.status(400).send({ message: "All Fields are Required" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findOneAndUpdate(
            { Email },
            { Password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

export { resetPassword, verifyOTP, forgotPassword };
