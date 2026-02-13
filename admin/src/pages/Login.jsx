import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'



const Login = () => {

  const { setAToken, backendURL } = useContext(AdminContext)

  const {setDToken}=useContext(DoctorContext)

  const [state, setState] = useState('Admin') // 'Admin' | 'Doctor'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (event) => {
  event.preventDefault()

  try {
    if (state === 'Admin') {
      const { data } = await axios.post(
        backendURL + '/api/admin/login',
        { email, password }
      )

      if (data.success) {
        localStorage.setItem('aToken', data.token)
        setAToken(data.token)
        toast.success('Admin login successful')
      } else {
        toast.error(data.message)
      }

    } else {
      
      const { data } = await axios.post(
        backendURL + '/api/doctor/login',
        { email, password }
      )

      if (data.success) {
        localStorage.setItem('dToken', data.token)
        setDToken(data.token)
        toast.success('Admin login successful')
      } else {
        toast.error(data.message)
      }

    }

  } catch (error) {
    console.log(error)
    toast.error(error.response?.data?.message || 'Login failed')
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-sm p-8 rounded-xl shadow-lg"
      >

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {state} Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5f6FFF]"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5f6FFF]"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#5f6FFF] text-white py-2 rounded-md font-medium
                     hover:opacity-90 transition-all"
        >
          Login
        </button>

        {/* Switch Login Type */}
        <p className="text-center text-sm text-gray-600 mt-5">
          {state === 'Admin'
            ? 'Login as Doctor? '
            : 'Login as Admin? '}
          <span
            onClick={() => setState(state === 'Admin' ? 'Doctor' : 'Admin')}
            className="text-[#5f6FFF] font-medium cursor-pointer"
          >
            Click here
          </span>
        </p>

      </form>

    </div>
  )
}

export default Login 