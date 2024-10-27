import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import AddContact from "./AddContacts";
import useGetConversations from "../../hooks/useGetConversations";
import { useReceiver } from "../../receiverProvider";

const Sidebar = () => {
  const { loading, conversations, refetchConversations } = useGetConversations();
  const { setReceiverId } = useReceiver();

  return (
    <div className="w-[380px] bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 bg-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1">
            <SearchInput />
          </div>
          <LogoutButton />
        </div>
      </div>
      <div className="h-px bg-gray-700 my-2" />
      <div className="flex-1 overflow-y-auto">
        <Conversations 
          conversations={conversations} 
          loading={loading} 
          onSelectChat={setReceiverId} 
        />
      </div>
      <div className="p-4 border-t border-gray-700">
        <AddContact onContactAdded={refetchConversations} />
      </div>
    </div>
  );
};

export default Sidebar;