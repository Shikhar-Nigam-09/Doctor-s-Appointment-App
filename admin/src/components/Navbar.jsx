import { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {
  const { setAToken } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)

  const navigate=useNavigate()
  const logout = () => {
    // clear both roles
    localStorage.removeItem('aToken')
    localStorage.removeItem('dToken')

    setAToken('')
    setDToken('')

    navigate('/')
  }

  return (
    <div className="w-full bg-white border-b px-6 sm:px-10 py-4 flex justify-between items-center">

      {/* Left: Bigger Logo Only */}
      <div className="flex items-center">
        <img
          src={assets.admin_logo}
          alt="Prescripto Admin"
          className="h-11 sm:h-12 cursor-pointer select-none"
        />
      </div>

      {/* Right: Logout Button */}
      <button
        onClick={logout}
        className="
          bg-[#5f6FFF]
          text-white
          text-sm
          font-medium
          px-8
          py-2
          rounded-full
          shadow-sm
          hover:shadow-md
          hover:opacity-90
          transition-all
        "
      >
        Logout
      </button>

    </div>
  )
}

export default Navbar
