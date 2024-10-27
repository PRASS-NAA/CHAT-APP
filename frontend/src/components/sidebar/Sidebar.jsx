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
		<div className='border-r border-slate-500 p-4 flex flex-col'>
			<SearchInput />
			<AddContact onContactAdded={refetchConversations} /> {/* Trigger re-fetch after contact added */}
			<div className='divider px-3'></div>
			<Conversations conversations={conversations} loading={loading} onSelectChat={setReceiverId} />
			<LogoutButton />
		</div>
	);
};

export default Sidebar;
