import { useState, useContext } from 'react'
import { AuthContext} from '../../contexts/authContext'
import axios from 'axios'
import { useNavigate} from 'react-router-dom'

const Login = () => {

    const [credentials, setCredentials] = useState({
      username: '',
      password: '',
    })
  
  const { loading, error, dispatch } = useContext(AuthContext)
  
  const navigate = useNavigate()
  
  const handleChange = (e) => {
  setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }
  
  const handleClick = async e => {
    e.preventDefault()
    dispatch({type:"LOGIN_START"})
    try {
        const res = await axios.post("http://localhost:8800/api/auth/login", credentials)
        const  {isAdmin}  = res.data;
        
        dispatch({type:"LOGIN_SUCCESS", payload:res.data.details})
        if(isAdmin) {
          navigate("/admindash")
        } else {
          navigate("/userdash")
        }   
        
         
    } catch (err) {
      dispatch({type:"LOGIN_FAILURE", payload:err.response.data})
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
    }
  }
  
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Event Manager</h2>
          <input 
            type="text" 
            placeholder="Username" 
            id="username" 
            onChange={handleChange} 
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            id="password" 
            onChange={handleChange} 
            className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            disabled={loading} 
            onClick={handleClick} 
            className={`w-full p-2 text-white font-bold rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'}`}
          >
            Login
          </button>
          {error && <span className="text-red-500 mt-4 block">{error.message}</span>}
          </div>
      </div>
    )
  }
  
  export default Login