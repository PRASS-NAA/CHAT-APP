import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log(userId);

        // Find the user by their ID and populate their contacts
        const user = await User.findById(userId).populate("contacts", "-password");

        if (!user) {
            console.log("User Not Found !!");
            return res.status(404).json({ error: "User Not Found" });
        }

        const contacts = Array.isArray(user.contacts) ? user.contacts : [];

        // Send only the populated contacts as an array
        res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error in Get Users in Sidebar Controller !!", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// In your addUser controller
export const addUser = async (req, res) => {
    try {
        const { username } = req.body; // Only username comes from frontend
        const loggedInUserId = req.user._id; // Get the logged-in user's ID

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        console.log("Function called to add contact:", username);

        // Find the contact by username
        const contact = await User.findOne({ username }); // Find user by username
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        // Find the user by loggedInUserId
        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the contact is already in the user's contacts array
        if (user.contacts.includes(contact._id.toString())) {
            return res.status(400).json({ error: "Contact already exists in your contacts" });
        }

        // Add the contact to the user's contacts array
        user.contacts.push(contact._id);

        // Save the updated user document
        await user.save();

        // Fetch the updated user with populated contacts
        const updatedUser = await User.findById(loggedInUserId).populate('contacts');

        res.status(200).json({ message: "Contact added successfully", contacts: updatedUser.contacts });
    } catch (error) {
        console.log("Error in addUser controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
