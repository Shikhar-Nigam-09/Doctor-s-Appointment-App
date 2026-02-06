import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Login = () => {

  const {backendURL,token,setToken}=useContext(AppContext)
  const navigate=useNavigate()

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')



  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if(state==='Sign Up'){
        const {data}=await axios.post(backendURL+'/api/user/register',{name,password,email})

        if(data.success)
        {
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }else{
        const {data}=await axios.post(backendURL+'/api/user/login',{password,email})

        if(data.success)
        {
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }

    if (state === 'Sign Up') {
      console.log('Creating account:', { name, email, password })
    } else {
      console.log('Logging in:', { email, password })
    }
  }

  useEffect(()=>{
    if(token)
    {
        navigate('/')
    }
  },[token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">

      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-sm bg-white border rounded-lg p-6 shadow-sm"
      >

        {/* Title */}
        <p className="text-xl font-medium text-gray-800 text-center">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </p>

        <p className="text-sm text-gray-600 text-center mt-1">
          Please {state === 'Sign Up' ? 'sign up' : 'login'} to book appointment
        </p>

        {/* Name (only for Sign Up) */}
        {state === 'Sign Up' && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-1">Full Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-[#5f6FFF]"
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-[#5f6FFF]"
            required
          />
        </div>

        {/* Password */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-[#5f6FFF]"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#5f6FFF] text-white py-2 rounded mt-6 hover:opacity-90 transition"
        >
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        {/* Toggle */}
        <p className="text-sm text-center text-gray-600 mt-4">
          {state === 'Sign Up'
            ? 'Already have an account? '
            : "Don't have an account? "}
          <span
            onClick={() =>
              setState(state === 'Sign Up' ? 'Login' : 'Sign Up')
            }
            className="text-[#5f6FFF] cursor-pointer underline"
          >
            {state === 'Sign Up' ? 'Login here' : 'Create one'}
          </span>
        </p>

      </form>
    </div>
  )
}

export default Login
