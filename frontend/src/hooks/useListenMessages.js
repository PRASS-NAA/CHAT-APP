import { useEffect, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { setMessages } = useConversation();

    const handleNewMessage = useCallback((newMessage) => {
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages(prevMessages => {
            const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
            return [...currentMessages, { ...newMessage, shouldShake: true }];
        });
    }, [setMessages]);

    const handleDeletedMessage = useCallback(({ messageId, message }) => {
        setMessages(prevMessages => {
            const currentMessages = Array.isArray(prevMessages) ? prevMessages : [];
            return currentMessages.map(msg =>
                msg._id === messageId
                    ? { ...msg, message: message, shouldShake: true }
                    : msg
            );
        });
    }, [setMessages]);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", handleNewMessage);
        socket.on("messageDeleted", handleDeletedMessage);

        // Cleanup function
        return () => {
            if (socket) {
                socket.off("newMessage", handleNewMessage);
                socket.off("messageDeleted", handleDeletedMessage);
            }
        };
    }, [socket, handleNewMessage, handleDeletedMessage]);
};

export default useListenMessages;