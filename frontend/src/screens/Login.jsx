import React,{useState} from 'react';
import { Link , useNavigate } from 'react-router-dom';
import axios from '../config/Axios';
import { useContext } from 'react';
import { UserContext } from '../Context/Usercontext';


const Login = () => {
    
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const Navigate = useNavigate();

const { User, setUser } = useContext(UserContext);

function submithandler(e){
  e.preventDefault();
  const user = { email, password };
  axios.post('/users/login', user)
    .then((res)=>{ 
  
      localStorage.setItem("token",res.data.token);   //setting the token in the local storage 
      setUser(res.data.user); // Set the user data in context
      Navigate('/')
    }
         )
    .catch(err => {
      console.error('Login failed:', err);
      // Handle login failure (e.g., show an error message)
    });
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
        <form  onSubmit={ submithandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input

             onChange={ (e)=>{ setEmail(e.target.value)}}
              value={email}
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input

               onChange={ (e)=>{ setPassword(e.target.value)}}
               value={password}
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;