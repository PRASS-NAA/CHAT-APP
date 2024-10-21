import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../util/generateToken.js";
import { sendVerificationEmail } from "../nodemailer/emails.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
    try {

        console.log(req.body); 

        const { fullname, email, username, password, confirmpass } = req.body;

        if (password !== confirmpass) {
            return res.status(400).json({ error: "Passwords Don't Match!",ref:1});
        }


        if(password.length >= 7)
        {
            const hasCaps = /[A-Z]/.test(password);
            const hasDigits = /\d/.test(password);

            if(!hasCaps || !hasDigits)
            {
                return res.status(400).json({error: "Passwords Must contain atleast one Capital Letter or Digit",ref:2});
            }
        }else{
            return res.status(400).json({error: "Passwords length must be atleast 7 characters long",ref:3});
        }

       
        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username Already Exists",ref:4});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profilePhoto = "/uploads/default.jpg";
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();


        const newUser = new User({
            fullname: fullname,
            username: username,
            email: email,
            password: hashedPassword,
            profilePhoto: profilePhoto,
            verificationToken: verificationToken
        });

        if(newUser)
        {
            generateTokenAndSetCookie(newUser._id,res);
            

            await sendVerificationEmail(newUser.email, verificationToken);

            await newUser.save();
            
            res.status(201).json({ message: "User created successfully!", user: newUser });
        }else{
            res.status(400).json({error: "Invalid User Data"});
        }
        
        
    } catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    console.log("Request Body:", req.body);

    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });
        console.log("User Found:", user);  // Log the found user

        if (!user) {
            console.log("No user found for username:", username);
            return res.status(400).json({ error: "Invalid Username or password" });
        }

        // Log the stored hashed password
        console.log("Stored Password Hash:", user.password);  

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
        console.log("Input Password:", password);  // Log the input password
        console.log("Is Password Correct:", isPasswordCorrect);  // Log the result of the password check

        if (!isPasswordCorrect) {
            console.log("Password is incorrect for user:", username);
            return res.status(400).json({ error: "Invalid Username or password" });
        }

        // Generate token and set cookie if login is successful
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "15d",
        });
    
        res.cookie("jwt", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days
            httpOnly: true,  // Prevent JavaScript access
            sameSite: "strict",  // CSRF protection
            secure: false,  // Set to true in production (HTTPS)
        });
        console.log("Token generated and cookie set");

        // Send user data
        return res.status(200).json({ user }); 

    } catch (error) {
        console.error("Error in Login Controller: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const verifymail = async(req,res) => {
    const {verificationCode} = req.body;

    try{
        const verificationTokenInt = parseInt(verificationCode, 10);

        const user = await User.findOne({verificationToken:verificationTokenInt});

        if(!user)
        {
            user.isVerified = false;
            user.verificationToken = undefined;
            await user.save();
            return res.status(400).json({message :"Invalid verification token"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        return res.status(200).json({message: "Email verified",user:user});
    }catch(error)
    {
        console.log("Error in verifymail controller !!",error.message);
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out Successfully"});
    }catch(error)
    {
        console.log("Error in Logout Controller : ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const deleteUser = async (req, res) => {
    const { verificationCode } = req.body;

    try {
        const user = await User.findOne({ verificationToken: verificationCode });
        console.log(user);

        if (!user) {
            return res.status(400).json({ error: "No Users Found!" });
        }

        // Proceed to delete the user
        const deleteResult = await User.deleteOne({ username: user.username });

        // Check if deletion was successful
        if (deleteResult.deletedCount === 1) {
            return res.status(200).json({ message: "User deleted successfully." });
        } else {
            return res.status(400).json({ error: "Failed to delete user." });
        }
    } catch (error) {
        console.log("Error in Deleting User controller:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
