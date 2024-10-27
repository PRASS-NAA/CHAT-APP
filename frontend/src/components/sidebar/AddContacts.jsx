// AddContact.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // For notifications

const AddContact = ({ onContactAdded }) => {
  const [username, setUsername] = useState("");

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/addcontact", { username });
      toast.success(response.data.message);
      setUsername("");
      onContactAdded();
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <form onSubmit={handleAddContact} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to add"
          className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddContact;