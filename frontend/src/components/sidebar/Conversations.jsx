import React from "react";
import { useReceiver } from '../../receiverProvider';
import useConversation from "../../zustand/useConversation";

const Conversations = ({ conversations = [], loading, onSelectChat }) => {
    const { setReceiverId } = useReceiver();
    const { setSelectedConversation } = useConversation();
  
    const handleContactClick = (contact) => {
      localStorage.setItem("receiverId", contact._id);
      setReceiverId(contact._id);
      setSelectedConversation(contact);
    };
  
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      );
    }
  
    return (
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((contact) => (
            <div
              key={contact._id}
              onClick={() => handleContactClick(contact)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors"
            >
              
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-200 font-medium truncate">
                  {contact.fullName}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  Click to start chatting
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            No contacts found
          </div>
        )}
      </div>
    );
  };

export default Conversations