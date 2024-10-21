import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, senderId, recv: receiverId } = req.body; // Use receiverId here

        console.log("Sender Id: ", senderId);
        console.log("Receiver Id: ", receiverId);
        console.log("Message sent: ", message);

        // Find or create a conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId, // Use receiverId, not recv
            message,
        });

        // Push the message into the conversation's message list
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);
        console.log("Message Sent");
    } catch (error) {
        console.log("Error in sendMessage Controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { senderId,receiverId } = req.body;
        console.log("im called getmesaages");

        // Find the conversation between the sender and receiver
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]); // Return an empty array if no conversations found
        }

        console.log(conversation);
        
        res.status(200).json(conversation.messages);
    } catch (err) {
        console.log("Error in getMessages controller:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
