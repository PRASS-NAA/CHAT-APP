import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();
	
	const isSelected = selectedConversation?._id === conversation._id;
	const isOnline = onlineUsers.includes(conversation._id);
  
	return (
	  <>
		<div
		  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
			${isSelected ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
		  onClick={() => setSelectedConversation(conversation)}
		>
		  
		  <div className="flex-1 min-w-0">
			<h3 className="text-gray-200 font-medium truncate">
			  {conversation.fullName}
			</h3>
			<p className="text-gray-400 text-sm truncate">
			  {isOnline ? 'Online' : 'Offline'}
			</p>
		  </div>
		</div>
		{!lastIdx && <div className="h-px bg-gray-700 mx-4" />}
	  </>
	);
  };
export default Conversation;  