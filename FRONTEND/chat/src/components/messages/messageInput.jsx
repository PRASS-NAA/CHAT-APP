import { useState } from "react";
import { BsSend } from "react-icons/bs";
import toast from "react-hot-toast";
import axios from "axios";

const MessageInput = ({ onMessageSent }) => {
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem("chat-user"));
            const senderId = user._id;
            const recv = localStorage.getItem("receiverId");

            if (!message.trim()) {
                toast.error("Message cannot be empty!");
                return;
            }

            if (!recv) {
                toast.error("No receiver selected!");
                return;
            }

            const response = await axios.post(
                `http://localhost:5000/api/message/send`,
                { message, senderId, recv }
            );

            if (response.status === 201) {
                onMessageSent(response.data);
                setMessage("");
                toast.success("Message sent successfully!");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error sending message");
        }
    };

    return (
        <form
            className='flex items-center gap-2 px-4 py-2 bg-gray-800 w-full'
            onSubmit={handleSubmit}
            style={{width:'954px',position:'relative',right:'61px'}}
        >
            <input
                type='text'
                className='flex-grow border rounded-lg p-2 bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-500'
                placeholder='Send a message'
                value={message}
                onChange={handleChange}
                style={{width:'3000px'}}
            />
            <button
                type='submit'
                className='p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
            >
                <BsSend size={20} />
            </button>
        </form>
    );
};

export default MessageInput;
