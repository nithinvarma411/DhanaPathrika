import { User } from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config()
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let existingUser = await User.findOne({ Email: profile.emails[0].value });

        if (existingUser) {
            return done(null, existingUser);  // Not a new user
        }

        const newUser = new User({
            Email: profile.emails[0].value,
            GoogleId: profile.id
        });

        await newUser.save();
        newUser.isNewUser = true;  // Mark new user
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
    }
}));


const register = async (req, res) => {
    try {
        const { MobileNumber, Email, Password, FaceDescriptor } = req.body;

        console.log("Received data:", { MobileNumber, Email, Password, FaceDescriptor });

        // Validate required fields
        if (!MobileNumber || !Email || !Password) {
            // console.log("Validation failed: Missing required fields.");
            return res.status(400).send({ "message": "All Fields are required" });
        }

        // Check if user already exists
        const existedUser = await User.findOne({ $or: [{ MobileNumber }, { Email }] });
        if (existedUser) {
            // console.log("Validation failed: User already exists.");
            return res.status(409).send({ "message": "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Ensure FaceDescriptor is an array of numbers
        // Ensure FaceDescriptor is an array of numbers
        var faceDescriptorArray = null;
        if (FaceDescriptor) {

            faceDescriptorArray = FaceDescriptor;
            if (typeof faceDescriptorArray === 'string') {
                try {
                    faceDescriptorArray = JSON.parse(faceDescriptorArray); // Parse string to array if needed
                } catch (error) {
                    // console.log('Invalid FaceDescriptor string format:', error);
                    return res.status(400).send({ "message": "Invalid FaceDescriptor format" });
                }
            }

            // Convert object to array if needed (Object.values)
            if (typeof faceDescriptorArray === 'object' && !Array.isArray(faceDescriptorArray)) {
                faceDescriptorArray = Object.values(faceDescriptorArray);
            }

            // Ensure it is an array of numbers
            if (!Array.isArray(faceDescriptorArray)) {
                return res.status(400).send({ "message": "FaceDescriptor should be an array" });
            }

            if (!faceDescriptorArray.every(item => typeof item === 'number' && isFinite(item))) {
                return res.status(400).send({ "message": "FaceDescriptor should contain only finite numbers" });
            }

            // Check for duplicate face
            if (faceDescriptorArray) {
                const users = await User.find({ FaceDescriptor: { $ne: null } });

                for (const user of users) {
                    if (!Array.isArray(user.FaceDescriptor) || user.FaceDescriptor.length !== 128) continue;

                    const distance = euclideanDistance(faceDescriptorArray, user.FaceDescriptor);

                    if (distance < 0.5) {
                        return res.status(409).send({ message: "Face already registered with another account" });
                    }
                }
            }

        }

        // Save user with correct FaceDescriptor format
        const newUser = new User({
            MobileNumber,
            Email,
            Password: hashedPassword,
            FaceDescriptor: faceDescriptorArray ? faceDescriptorArray : null
        });

        await newUser.save();


        // Generate a JWT token for the user
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '10d' });

        // Set the token as a cookie in the response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        });

        // console.log("User registered successfully.");
        return res.status(200).send({ "message": "User created successfully" });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { NumberOrEmail, Password } = req.body;

        if (!NumberOrEmail || !Password) {
            return res.status(400).send({ "message": "All Fields are required" });
        }

        const isMobile = /^[0-9]{10}$/.test(NumberOrEmail);
        const query = isMobile ? { MobileNumber: NumberOrEmail } : { Email: NumberOrEmail };

        // console.log(query);

        const user = await User.findOne(query);
        // console.log("user", user);
        if (!user) {
            return res.status(404).send({ "message": "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).send({ "message": "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });
        // console.log("token", token);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).send({ "message": "Login successful", user });

    } catch (error) {
        console.error("Error in login", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account consent'
});


const googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
    prompt: 'select_account consent',

});

const googleAuthSuccess = (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: "Authentication failed" });
    }

    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Check if the user is new
    const baseURL = process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : `${process.env.ORIGIN}`;

    const redirectURL = req.user.isNewUser ? `${baseURL}/details` : `${baseURL}/home`;


    res.redirect(redirectURL);
};



const logout = (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(400).send({ "message": "No cookie is present" });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).send({ "message": "Logout successful" });
    } catch (error) {
        console.error("Error in logout", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};

const faceLogin = async (req, res) => {
    try {
        let { descriptor } = req.body; // Might be array, stringified array, or object

        // console.log("Received descriptor:", descriptor);

        // Parse descriptor if needed
        if (typeof descriptor === 'string') {
            try {
                descriptor = JSON.parse(descriptor);
            } catch (error) {
                return res.status(400).send({ message: "Invalid FaceDescriptor format" });
            }
        }

        if (typeof descriptor === 'object' && !Array.isArray(descriptor)) {
            descriptor = Object.values(descriptor);
        }

        if (
            !descriptor ||
            !Array.isArray(descriptor) ||
            descriptor.length !== 128 ||
            !descriptor.every(item => typeof item === 'number' && isFinite(item))
        ) {
            return res.status(400).send({ message: "Face descriptor missing, invalid, or incorrect format" });
        }

        // Find all users with FaceDescriptor
        const users = await User.find({ FaceDescriptor: { $ne: null } });

        for (const user of users) {
            if (!Array.isArray(user.FaceDescriptor) || user.FaceDescriptor.length !== 128) continue;

            const distance = euclideanDistance(descriptor, user.FaceDescriptor);

            if (distance < 0.5) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10d' });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                return res.status(200).send({ message: "Face login successful", user });
            }
        }

        return res.status(401).send({ message: "Face not recognized" });

    } catch (error) {
        console.error("Error in face login:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};


// Helper function to calculate Euclidean distance
function euclideanDistance(arr1, arr2) {
    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        sum += Math.pow(arr1[i] - arr2[i], 2);
    }
    return Math.sqrt(sum);
}




export { register, login, googleAuth, googleAuthCallback, googleAuthSuccess, logout, faceLogin };

