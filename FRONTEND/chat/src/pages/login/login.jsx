import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Login = () => {

	const navigate = useNavigate();
	const { setAuthUser } = useAuthContext();

	const[Person,setPerson] = useState({
		username:'',
		password:''
	})

	const handleChange = (e)=>
	{
		const name = e.target.name;
		const value = e.target.value;
		setPerson({...Person,[name]:value});
	}

	const handleSubmit = async(e)=>
	{
		e.preventDefault();
		

		//console.log(Person);
		try{
			const res = await axios.post("http://localhost:5000/api/auth/login",Person);

			console.log(res.data.user);

			if(res.status == 200)
			{
				toast.success("Login Succesfull !!");

				const userdata = res.data;
				localStorage.setItem("chat-user", JSON.stringify(res.data.user));
				const token = res.data.token;
				// Update the authUser state in context
				setAuthUser(userdata);
				navigate("/homepage");
			}
		}catch(error)
		{
			//axios consider all 4xx errors as exceptions
			if (error.response && error.response.status === 400) {
				toast.error("Invalid Username or Password!");
				console.log("Invalid credentials");
			} else {
				// Handle other types of errors
				toast.error("Login Error! Please Try Later");
				console.log("Login Exception: ", error.message);
			}
		}
	}

  	return (
   		<div style = {{paddingTop:'48px'}}className='flex flex-col items-center justify-center min-w-96 mx-auto'>
   			<div className='w-1/3 p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border-2 border-gray-400 hover:border-blue-500 '>
   				<h1 className='text-3xl font-semibold text-center text-gray-300'>
   					Login
   					<span className='text-blue-500'> ChatApp</span>
   				</h1>
  
   				<form onSubmit={handleSubmit}>
   					<div>
   						<label className='label p-2'>
   							<span className='text-base label-text'>Username</span>
   						</label>
   						<input type='text' name='username' value= {Person.username} placeholder='Enter username' className='w-full input input-bordered border-gray-400 hover:border-blue-500 h-10' onChange={handleChange}/>
   					</div>
  
   					<div>
   						<label className='label'>
   							<span className='text-base label-text'>Password</span>
   						</label>
   						<input
   							type='password'
							name='password'
							value={Person.password}
   							placeholder='Enter Password'
   							className='w-full input input-bordered border-gray-400 hover:border-blue-500 h-10'
							onChange={handleChange}
   						/>
   					</div>
   					<Link to='/signup' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
   						{"Don't"} have an account?
   					</Link>
  
   					<div>
   						<button className='btn btn-block btn-sm mt-2 border-gray-400 hover:border-blue-500 h-10'>Login</button>
   					</div>
   				</form>
   			</div>
   		</div>
   	);
   };
 export default Login;