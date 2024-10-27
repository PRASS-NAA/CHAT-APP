import React from "react";
import { useReceiver } from '../../receiverProvider';
import useConversation from "../../zustand/useConversation";

const Conversations = ({ conversations = [], loading, onSelectChat }) => {
    const { setReceiverId } = useReceiver();
    const { setSelectedConversation } = useConversation();

    const handleContactClick = (contact) => {
        console.log("Contact clicked:", contact._id);
        localStorage.setItem("receiverId", contact._id); // Store the receiver ID
        setReceiverId(contact._id); // Update the receiver ID in global state
        setSelectedConversation(contact); // Update selected conversation in Zustand
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="overflow-y-auto max-h-[400px]">
            {conversations.length > 0 ? (
                conversations.map((contact) => (
                    <div 
                        key={contact._id} 
                        className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'
                        onClick={() => handleContactClick(contact)}
                    >
                        <div className='avatar online'>
                            <div className='w-12 rounded-full'>
                                <img
                                    src={contact.avatar || 'https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'}
                                    alt={`${contact.fullName}'s avatar`}
                                />
                            </div>
                        </div>
                        <div className='flex flex-col flex-1'>
                            <div className='flex gap-3 justify-between'>
                                <p className='font-bold text-gray-200'>{contact.fullName}</p>
                                <span className='text-xl'>🎃</span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>No contacts found.</p>
            )}
            <div className='divider my-0 py-0 h-1' />
        </div>
    );
};

export default Conversations;
