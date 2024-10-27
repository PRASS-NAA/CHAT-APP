import { create } from "zustand";

const useConversation = create((set) => ({
    selectedConversation: null,
    messages: [], // Initialize as empty array
    setSelectedConversation: (selectedConversation) => 
        set({ selectedConversation }),
    setMessages: (messages) => 
        set((state) => ({
            messages: Array.isArray(messages) 
                ? messages 
                : typeof messages === "function"
                    ? messages(state.messages)
                    : []
        })),
}));

export default useConversation;