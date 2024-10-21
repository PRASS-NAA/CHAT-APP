import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,  // 15 days
        httpOnly: true,  // Prevent JavaScript access
        sameSite: "strict",  // CSRF protection
        secure: false,  // Set to true in production (HTTPS)
    });

    
};

export default generateTokenAndSetCookie;