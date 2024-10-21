import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchInput from "./searchInput";
import Conversations from "./conversations";
import LogoutButton from "./logoutButton";
import AddContact from "./addContacts";
import { useReceiver } from '../../receiverProvider';

const Sidebar = () => {
    const [contacts, setContacts] = useState([]);
    const { setReceiverId } = useReceiver(); // Access the setReceiverId function

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("chat-user"));
                const res = await axios.get(`http://localhost:5000/api/users/getsidebar?userId=${user._id}`);
                setContacts(res.data.contacts);
            } catch (err) {
                console.log("Error Fetching Contacts !! ", err);
            }
        };

        fetchContacts();
    }, []);

    const handleContactAdded = (newContacts) => {
        setContacts(newContacts);
    };

    return (
        <div className="w-1/4 bg-gray-800 text-white flex flex-col justify-between h-full">
            <div className="p-4">
                <SearchInput />
                <div className="my-4 border-b border-gray-700"></div>
                {/* Pass setReceiverId to Conversations */}
                <Conversations contacts={contacts} onSelectChat={setReceiverId} />
            </div>
            <div className="p-4">
                <LogoutButton />
            </div>
            <AddContact onContactAdded={handleContactAdded} />
        </div>
    );
};

export default Sidebar;
