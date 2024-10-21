// Chat.js
import { useReceiver } from '../../receiverProvider';// Adjust the path as necessary
import MessageInput from './messageInput';
import Messages from './messages';

const Chat = () => {
    const { receiverId, setReceiverId } = useReceiver();

    const handleChatClick = (newReceiverId) => {
        setReceiverId(newReceiverId);
    };

    return (
        <div className='flex flex-col h-screen max-w-3xl mx-auto bg-gray-900'>
            <div className='flex-grow overflow-y-auto p-4'>
                <Messages receiverId={receiverId} />
            </div>
            <MessageInput onMessageSent={(newMessage) => {
                console.log(newMessage);
            }} />
        </div>
    );
};

export default Chat;
