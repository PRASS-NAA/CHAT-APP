import { encrypt, decrypt } from '../utils/cryptoUtils.js';
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { logMessage } from "../utils/logger.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        const senderUsername = req.user.username; // Assuming username is in req.user

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

        // Log the message sending activity
        logMessage(`${senderUsername} -> sent message to -> ${receiverId}`);

        // Decrypt the message before emitting it through Socket.IO
        const decryptedMessage = decrypt(encryptedMessage);
        newMessage.message = decryptedMessage;

        // SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                ...newMessage._doc,
                message: decryptedMessage,
            });
        }

        res.status(201).json(newMessage);
    } catch (error) {
        logMessage(`Error in sendMessage: ${error.message}`);
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const username = req.user.username;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) {
            logMessage(`${username} -> attempted to fetch messages -> no conversation found`);
            return res.status(200).json([]);
        }

        // Decrypt each message before sending the response
        const messages = conversation.messages.map((msg) => {
            try {
                const decryptedMessage = decrypt(msg.message);
                return {
                    ...msg._doc,
                    message: decryptedMessage,
                };
            } catch (error) {
                logMessage(`Failed to decrypt message for user ${username}`);
                return msg;
            }
        });

        logMessage(`${username} -> fetched messages with -> ${userToChatId}`);
        res.status(200).json(messages);
    } catch (error) {
        logMessage(`Error in getMessages: ${error.message}`);
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.body;
        const userId = req.user._id;
        const username = req.user.username;

        const message = await Message.findById(messageId);
        
        if (!message) {
            logMessage(`${username} -> attempted to delete non-existent message`);
            return res.status(404).json({ error: "Message not found" });
        }

        if (message.senderId.toString() !== userId.toString()) {
            logMessage(`${username} -> unauthorized attempt to delete message`);
            return res.status(403).json({ error: "Unauthorized to delete this message" });
        }

        const encryptedDeletedMessage = encrypt("This message has been deleted");
        message.message = encryptedDeletedMessage;
        await message.save();

        logMessage(`${username} -> deleted message -> ${messageId}`);

        const receiverSocketId = getReceiverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", {
                messageId: message._id,
                message: "This message has been deleted"
            });
        }

        res.status(200).json({
            messageId: message._id,
            message: "This message has been deleted"
        });
    } catch (error) {
        logMessage(`Error in deleteMessage: ${error.message}`);
        console.log("Error in deleteMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};