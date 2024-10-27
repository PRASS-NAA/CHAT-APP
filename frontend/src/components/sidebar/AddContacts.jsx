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
        onContactAdded(); // Trigger re-fetch after adding contact
      } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred.");
      }
    };
  
    return (
      <form onSubmit={handleAddContact} className='flex items-center mb-4'>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className='border border-slate-500 rounded p-2 flex-grow'
          required
        />
        <button type="submit" className='ml-2 bg-blue-500 text-white rounded p-2'>Add</button>
      </form>
    );
  };
  
  export default AddContact;
  