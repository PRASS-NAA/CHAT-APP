import React from "react";
import { useAuthContext } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const LogoutButton = ()=>
{
    const {setAuthUser} = useAuthContext();
    const logout = async()=>
    {
        try{
            const res = await axios.post("http://localhost:5000/api/auth/logout");

            if(res.error)
            {
                throw new Error(res.error);
            }

            localStorage.removeItem("chat-user");
            setAuthUser(null);
        }catch(error)
        {
            toast.error(error.message);
        }
    }

    return (
        <>
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logout</button>
        </>
    )
}

export default LogoutButton;