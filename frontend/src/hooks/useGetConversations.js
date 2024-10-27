import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	const fetchConversations = async () => {
		setLoading(true);
		try {
			const user = JSON.parse(localStorage.getItem("chat-user")); // Get user data from localStorage
			const res = await axios.get(`http://localhost:5000/api/users/getsidebar?userId=${user._id}`);
			setConversations(res.data.contacts || []);
		} catch (error) {
			toast.error("Error fetching conversations");
		} finally {
			setLoading(false);
		}
	};

	// Fetch on mount
	useEffect(() => {
		fetchConversations();
	}, []);

	return { loading, conversations, refetchConversations: fetchConversations };
};

export default useGetConversations;
