import { encrypt, decrypt } from '../utils/cryptoUtils.js';
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        // Encrypt the message before storing it
        const encryptedMessage = encrypt(message);

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message: encryptedMessage,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // Decrypt the message before emitting it through Socket.IO
        const decryptedMessage = decrypt(encryptedMessage);
		newMessage.message = decryptedMessage;

        // SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // Emit the decrypted message to the receiver
            io.to(receiverSocketId).emit("newMessage", {
                ...newMessage._doc, // Include all other message fields
                message: decryptedMessage, // Send the decrypted message
            });
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) {
            console.log("No conversation found.");
            return res.status(200).json([]);
        }

        // Decrypt each message before sending the response
        const messages = conversation.messages.map((msg) => {
            try {
                const decryptedMessage = decrypt(msg.message);
                // console.log("Decrypted message: ", decryptedMessage);
                return {
                    ...msg._doc, // Spread operator to include other message fields
                    message: decryptedMessage, // Replace the encrypted message with the decrypted one
                };
            } catch (error) {
                console.log("Failed to decrypt message: ", error.message);
                return msg; // Return the original message if decryption fails
            }
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};