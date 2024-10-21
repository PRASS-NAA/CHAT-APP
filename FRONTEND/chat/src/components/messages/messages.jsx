import { useEffect, useState } from "react";
import Message from "./message";
import axios from "axios";
import { useReceiver } from "../../receiverProvider";

const Messages = () => {
    const { receiverId } = useReceiver(); // Get receiverId from context
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Clear previous messages when receiverId changes
        setMessages([]);

        const fetchMessages = async () => {
            if (!receiverId) return; // Return early if receiverId is not set

            try {
                const user = JSON.parse(localStorage.getItem("chat-user"));
                const senderId = user._id;

                console.log("Fetching messages for:", { senderId, receiverId });

                const response = await axios.post(
                    `http://localhost:5000/api/message/getmessages`,
                    { senderId, receiverId }
                );

                console.log("Messages fetched:", response.data);
                setMessages(response.data); // Update state with new messages
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [receiverId]); // Ensure receiverId is in the dependency array

    const user = JSON.parse(localStorage.getItem("chat-user"));
    const currentUserId = user?._id;

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {messages.length === 0 ? (
                <p>No messages found.</p> // Indicate no messages
            ) : (
                messages.map((msg, index) => (
                    <Message
                        key={index}
                        message={msg.message}
                        timestamp={msg.timestamp}
                        senderId={msg.senderId}
                        currentUserId={currentUserId} // Pass current user ID for alignment
                    />
                ))
            )}
        </div>
    );
};

export default Messages;
