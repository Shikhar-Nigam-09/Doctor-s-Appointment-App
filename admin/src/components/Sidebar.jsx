import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const { aToken } = useContext(AdminContext)

  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="pt-6 text-[#515151]">

          {/* Dashboard */}
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer
              ${isActive ? 'bg-gray-300 border-r-4 border-[#5f6FFF]' : ''}`
            }
          >
            <img src={assets.home_icon} alt="" className="w-5" />
            <p className="text-sm font-medium">Dashboard</p>
          </NavLink>

          {/* Appointments */}
          <NavLink
            to="/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer
              ${isActive ? 'bg-gray-300 border-r-4 border-[#5f6FFF]' : ''}`
            }
          >
            <img src={assets.appointment_icon} alt="" className="w-5" />
            <p className="text-sm font-medium">Appointments</p>
          </NavLink>

          {/* Add Doctor */}
          <NavLink
            to="/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer
              ${isActive ? 'bg-gray-300 border-r-4 border-[#5f6FFF]' : ''}`
            }
          >
            <img src={assets.add_icon} alt="" className="w-5" />
            <p className="text-sm font-medium">Add Doctor</p>
          </NavLink>

          {/* Doctors List */}
          <NavLink
            to="/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-6 md:px-9 md:min-w-72 cursor-pointer
              ${isActive ? 'bg-gray-300 border-r-4 border-[#5f6FFF]' : ''}`
            }
          >
            <img src={assets.people_icon} alt="" className="w-5" />
            <p className="text-sm font-medium">Doctors List</p>
          </NavLink>

        </ul>
      )}
    </div>
  )
}

export default Sidebar
