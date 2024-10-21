import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthContext } from '../../context/AuthContext';

const Verification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const verificationCode = location.state?.verificationToken; // Retrieve verification code from state

    const [usercode,setUsercode] = useState('');
    const {setAuthUser} = useAuthContext();

    const handleChange = (e) =>
    {
        setUsercode(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(usercode);
        console.log('Came from signup page:', verificationCode);
    
        if (verificationCode === usercode) {
            try {
                const res = await axios.post("http://localhost:5000/api/auth/verify-email", { verificationCode: usercode });
                console.log(res);
    
                if (res.status === 200) {
                    toast.success("Email verified!");

                    const userdata = res.data.user;
                    localStorage.setItem("chat-user", JSON.stringify(userdata));
                    setAuthUser(userdata);
                    navigate("/homepage");
                }
            } catch (error) {
                console.error("Error verifying email:", error);
                toast.error("Invalid Verification Code! Sign-up Again!");
    
                try {
                    
                    const deleteRes = await axios.post("http://localhost:5000/api/auth/delete-user", { verificationCode: usercode });
                    console.log(deleteRes);
    
                    if (deleteRes.status === 200) {
                        toast.success("User deleted successfully, redirecting to Sign-up");
                        navigate("/signup");
                    } else {
                        toast.error("Application Error! Failed to delete user.");
                    }
                } catch (deleteError) {
                    console.error("Error deleting user:", deleteError);
                    toast.error("Error during user deletion.");
                }
            }
        } else {
            toast.error("Invalid Verification Code.");
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <h1 className='text-3xl font-semibold text-center text-gray-300'>Verify Your Email</h1>

            <form onSubmit={handleSubmit}>
                <div>
   					<label className='label p-2'>
   						<span className='text-base label-text'>Enter Verification code </span>
   					</label>
   						<input name = 'usercode' type='text' placeholder='Enter verification code' className='w-full input input-bordered border-gray-400 hover:border-blue-500 h-10' onChange={handleChange}/>
   				</div>

                <div>
   					<button className='btn btn-block btn-sm mt-2 border-gray-400 hover:border-blue-500 h-10'>Login</button>
   				</div>
            </form>
        </div>
    );
};

export default Verification;
