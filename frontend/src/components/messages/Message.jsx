import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import axios from 'axios';

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "";
    const shakeClass = message.shouldShake ? "shake" : "";

    const handleDeleteMessage = async () => {
        try {
            const response = await axios.post('/api/messages/delete', {
                messageId: message._id
            });
            
            if (response.data) {
                // Update the message content to show it's deleted
                message.message = "This message has been deleted";
            }
        } catch (error) {
            console.log("Error deleting message:", error);
        }
    };

    return (
        <div className={`chat ${chatClassName}`}>
            <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 relative group`}>
                {message.message}
                {fromMe && (
                    <button
                        onClick={handleDeleteMessage}
                        className="absolute hidden group-hover:block top-1 right-1 text-xs opacity-60 hover:opacity-100"
                    >
                        🗑️
                    </button>
                )}
            </div>
            <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
                {formattedTime}
            </div>
        </div>
    );
};

export default Message;