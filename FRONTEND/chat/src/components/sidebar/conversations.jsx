import React from "react";
import { useReceiver } from '../../receiverProvider';
const Conversations = ({ contacts = [] }) => {
    const { setReceiverId } = useReceiver(); // Access setReceiverId from context

    const handleContactClick = (contactId) => {
        console.log("Contact clicked:", contactId); // Log the clicked contact ID
        localStorage.setItem("receiverId", contactId); // Store the receiver ID in local storage
        setReceiverId(contactId); // Update the global state
        console.log("Receiver ID set globally:", contactId);
    };

    return (
        <div className="overflow-y-auto max-h-[400px]">
            {contacts.length > 0 ? (
                contacts.map((contact) => (
                    <div 
                        key={contact._id} 
                        className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'
                        onClick={() => handleContactClick(contact._id)} // Use the click handler here
                    >
                        <div className='avatar online'>
                            <div className='w-12 rounded-full'>
                                <img
                                    src={contact.avatar || 'https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'}
                                    alt={`${contact.fullname}'s avatar`} // Use fullname here
                                />
                            </div>
                        </div>

                        <div className='flex flex-col flex-1'>
                            <div className='flex gap-3 justify-between'>
                                <p className='font-bold text-gray-200'>{contact.fullname}</p> {/* Corrected name to fullname */}
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
