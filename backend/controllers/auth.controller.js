import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { logAuth } from "../utils/logger.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            logAuth(`${username} -> failed to signup -> passwords don't match`);
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            logAuth(`${username} -> failed to signup -> username already exists`);
            return res.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePhoto = "/uploads/default.jpg";

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            profilePic: profilePhoto
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            logAuth(`${username} -> signed up successfully`);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        } else {
            logAuth(`${username} -> failed to signup -> invalid user data`);
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        logAuth(`Error in signup: ${error.message}`);
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            logAuth(`${username} -> failed to login -> invalid credentials`);
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);
        logAuth(`${username} -> logged in successfully`);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        logAuth(`Error in login: ${error.message}`);
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        const username = req.user?.username; // Assuming you have user info in req.user
        res.cookie("jwt", "", { maxAge: 0 });
        logAuth(`${username} -> logged out`);
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        logAuth(`Error in logout: ${error.message}`);
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};