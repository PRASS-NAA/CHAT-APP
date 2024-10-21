import express from "express";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const userId = req.query.userId;

        const user = await User.findById(userId).populate('contacts'); // Await the result

        if (!user) {
            console.log("User Not Found !!");
            return res.status(404).json({ error: "User Not Found" });
        }

        console.log(user);

        const contacts = Array.isArray(user.contacts) ? user.contacts : [];

        res.status(200).json({ contacts: contacts });
    } catch (error) {
        console.log("Error in Get Users in Sidebar Controller !! ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addUser = async (req, res) => {
    try {
        const userId = req.body.userId; // Assuming req.user is populated by your authentication middleware
        const { username } = req.body; // Expecting username instead of contactId

        console.log("Function called to add user:", username);

        // Find the contact by username
        const contact = await User.findOne({ username }); // Find user by username
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        const user = await User.findById(userId);

        // Check if the contact is already in the user's contacts array
        if (user.contacts.includes(contact._id.toString())) { // Ensure we're comparing the same type
            return res.status(400).json({ error: "Contact already exists in your contacts" });
        }

        // Add the contact to the user's contacts array
        user.contacts.push(contact._id);

        // Save the updated user document
        await user.save();

        const updatedUser = await User.findById(userId).populate('contacts');

        res.status(200).json({ message: "Contact added successfully", contacts: updatedUser.contacts });
    } catch (error) {
        console.log("Error in AddUser controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
