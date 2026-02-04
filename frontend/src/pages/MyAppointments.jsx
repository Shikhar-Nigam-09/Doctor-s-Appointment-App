import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {

  const { doctors } = useContext(AppContext)

  return (
    <div className="md:mx-10 mt-10">

      {/* Page Title */}
      <p className="text-2xl font-medium text-gray-800 mb-6">
        My Appointments
      </p>

      {/* Appointments List */}
      <div className="space-y-6">

        {doctors.slice(0, 3).map((item, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center
                       border rounded-xl p-6 bg-white"
          >

            {/* Doctor Info */}
            <div className="flex gap-4 flex-1">

              {/* Doctor Image */}
              <img
                className="w-24 h-24 rounded-lg object-cover bg-blue-50"
                src={item.image}
                alt={item.name}
              />

              {/* Doctor Details */}
              <div className="text-sm text-gray-600">
                <p className="text-base font-medium text-gray-800">
                  {item.name}
                </p>
                <p className="mb-2">{item.speciality}</p>

                <p className="font-medium text-gray-700">Address:</p>
                <p>{item.address.line1}</p>
                <p>{item.address.line2}</p>

                <p className="mt-2">
                  <span className="font-medium text-gray-700">
                    Date & Time:
                  </span>{' '}
                  25 July, 2024 | 8:30 PM
                </p>
              </div>

            </div>

            {/* Actions */}
<div className="flex flex-col gap-3 min-w-40">

 {/* Pay Now */}
  <button
    className="
      border border-gray-300 text-gray-600 py-2 rounded-lg text-sm
      transition-all duration-300
      hover:bg-[#5f6FFF] hover:text-white hover:border-[#5f6FFF]
    "
  >
    Pay Now
  </button>

  {/* Cancel */}
  <button
    className="
      border border-gray-300 text-gray-600 py-2 rounded-lg text-sm
      transition-all duration-300
      hover:bg-red-500 hover:text-white hover:border-red-500
    "
  >
    Cancel appointment
  </button>

</div>


          </div>
        ))}

      </div>

    </div>
  )
}

export default MyAppointments
