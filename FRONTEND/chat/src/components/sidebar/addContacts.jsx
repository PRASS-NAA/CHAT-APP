import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AddContact = ({ onContactAdded }) => {
    const [contactId, setContactId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleAddContact = async (e) => {
        e.preventDefault();

        try {
            // Make API call to add the contact
            const user = JSON.parse(localStorage.getItem("chat-user"));
            const response = await axios.post(
                "http://localhost:5000/api/users/adduser",
                { username: contactId, userId: user._id }
            );

            // Clear input field after successful addition
            if (response.status === 200) {
                onContactAdded(response.data.contacts); // Update contact list on successful addition
                setContactId("");
                setErrorMessage("");
                toast.success("Contact added successfully!");
            }
        } catch (error) {
            // Check the error response and set the error message accordingly
            if (error.response) {
                setErrorMessage(error.response.data.error || "An error occurred while adding the contact.");
            } else {
                setErrorMessage("Network error: Please try again later.");
            }
        }
    };

    return (
        <div className="p-4">
            <form onSubmit={handleAddContact} className="flex flex-col gap-2">
                <label htmlFor="contactId" className="text-white">Add New Contact by Username</label>
                <input
                    type="text"
                    id="contactId"
                    value={contactId}
                    onChange={(e) => setContactId(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                    placeholder="Enter Contact ID"
                    required
                />
                <button
                    type="submit"
                    className="btn btn-primary mt-2"
                >
                    Add Contact
                </button>
            </form>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
    );
};

export default AddContact;
