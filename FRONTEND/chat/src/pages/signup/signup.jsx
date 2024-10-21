import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import Verification from "./emailverification"; // Importing the verification component
import axios from 'axios';

const SignUp = () => {
    const [person, setPerson] = useState({
        fullname: '',
        email: '',
        username: '',
        password: '',
        confirmpass: ''
    });

	const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState(null); 

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setPerson({ ...person, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(person);

        const success = handleInputError(person);
        if (success) {
            try {
                const res = await axios.post("http://localhost:5000/api/auth/signup", person);
				console.log("i anm from backend");
                console.log(res);

                if (res.status == 201) {
                    const verificationToken = res.data.user.verificationToken; // Correct access to the verificationToken
            		setVerificationCode(verificationToken); // Store the verification token in state
            		console.log(verificationToken);
            		toast.success("Sign-up successful! Check your email for verification.");
            		navigate("/verification", { state: { verificationToken } });
                }

                

            } catch (error) {
                toast.error(error.message);
            }
        } else {
            toast.error("Provide Valid credentials");
        }
    }

    return (
        <div style={{ paddingTop: '100px' }} className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-1/3 p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border-2 border-gray-400 hover:border-blue-500'>
                <h1 className='text-3xl font-semibold text-center text-gray-300'>
                    Sign Up <span className='text-blue-500'> ChatApp</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>Full Name</span>
                        </label>
                        <input name='fullname' value={person.fullname} type='text' placeholder='John Doe' className='w-full input input-bordered border-gray-400 hover:border-blue-500 h-10' onChange={handleChange} />
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text'>Email</span>
                        </label>
                        <input name='email' value={person.email} type='text' placeholder='Your office Mail' className='w-full input input-bordered border-gray-400 hover:border-blue-500 h-10' onChange={handleChange} />
                    </div>

                    <div>
                        <label className='label p-2 '>
                            <span className='text-base label-text'>Username</span>
                        </label>
                        <input name='username' value={person.username} type='text' placeholder='johndoe' className='w-full input input-bordered border-gray-400 hover:border-blue-500 h-10' onChange={handleChange} />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='w-full input input-bordered h-10 border-gray-400 hover:border-blue-500'
                            onChange={handleChange}
                            name='password'
                            value={person.password}
                        />
                    </div>

                    <div>
                        <label className='label'>
                            <span className='text-base label-text'>Confirm Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            className='w-full input input-bordered h-10 border-gray-400 hover:border-blue-500'
                            onChange={handleChange}
                            name='confirmpass'
                            value={person.confirmpass}
                        />
                    </div>

                    <Link to='/' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
                        Already have an account?
                    </Link>

                    <div>
                        <button className='btn btn-block btn-sm mt-2 border border-slate-700 hover:border-blue-500'>Sign Up</button>
                    </div>
                </form>

                {/* Display the Verification component if the verification code is available */}
                {verificationCode && <Verification verificationCode={verificationCode} />}
            </div>
        </div>
    );
};

export default SignUp;

function handleInputError(person) {
    let { fullname, username, password, confirmpass } = person;

    if (!fullname || !username || !password || !confirmpass) {
        toast.error("Please fill in all fields");
        return false;
    }
    if (password !== confirmpass) {
        toast.error("Passwords Don't Match");
        return false;
    }

    if (password.length < 7) {
        toast.error("Password must be at least 7 characters");
        return false;
    }

    return true;
}
