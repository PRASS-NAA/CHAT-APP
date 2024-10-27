import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
    const { messages, loading } = useGetMessages();
    useListenMessages();
    const lastMessageRef = useRef();

    useEffect(() => {
        if (messages?.length > 0) {
            setTimeout(() => {
                lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages]);

    // Guard against messages being undefined/null
    const messageList = Array.isArray(messages) ? messages : [];

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {!loading &&
                messageList.length > 0 &&
                messageList.map((message, idx) => (
                    <div 
                        key={message._id} 
                        ref={idx === messageList.length - 1 ? lastMessageRef : null}
                    >
                        <Message message={message} />
                    </div>
                ))}

            {loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
            {!loading && messageList.length === 0 && (
                <p className='text-center'>Send a message to start the conversation</p>
            )}
        </div>
    );
};

export default Messages;