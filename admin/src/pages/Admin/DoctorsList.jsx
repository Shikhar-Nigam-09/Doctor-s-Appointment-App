import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, backendURL,changeAvailability } =
    useContext(AdminContext)

  const [loadingId, setLoadingId] = useState(null)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          All Doctors
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage doctors availability and details
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {doctors.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          >

            {/* Doctor Image */}
            <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full object-cover"
              />
            </div>

            {/* Doctor Info */}
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-800">
                {item.name}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {item.speciality}
              </p>

              {/* Availability Toggle */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-medium ${
                    item.available ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {item.available ? 'Available' : 'Unavailable'}
                </span>

                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.available}
                    disabled={loadingId === item._id}
                    onChange={() => changeAvailability(item._id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default DoctorsList