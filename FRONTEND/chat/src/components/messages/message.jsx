import React from 'react';

const Message = ({ message, timestamp, senderId, currentUserId }) => {
  // Format the timestamp for better readability
  const formattedTimestamp = new Date(timestamp).toLocaleString();

  return (
    <div className={`chat ${senderId === currentUserId ? 'chat-end' : 'chat-start'}`}>
      <div className='chat-image avatar'>
        <div className='w-10 rounded-full'>
          <img
            alt='User Avatar'
            src={
              'https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
            }
          />
        </div>
      </div>
      <div className={`chat-bubble text-white ${senderId === currentUserId ? 'bg-blue-500' : 'bg-gray-400'}`}>
        {message}
      </div>
      <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
        {formattedTimestamp}
      </div>
    </div>
  );
};

export default Message;
