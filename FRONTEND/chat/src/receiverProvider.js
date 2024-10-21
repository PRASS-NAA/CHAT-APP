// ReceiverContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const ReceiverContext = createContext();

export const useReceiver = () => {
    return useContext(ReceiverContext);
};

export const ReceiverProvider = ({ children }) => {
    const [receiverId, setReceiverId] = useState(localStorage.getItem("receiverId") || "");

    useEffect(() => {
        localStorage.setItem("receiverId", receiverId); // Update localStorage whenever receiverId changes
    }, [receiverId]);

    return (
        <ReceiverContext.Provider value={{ receiverId, setReceiverId }}>
            {children}
        </ReceiverContext.Provider>
    );
};
