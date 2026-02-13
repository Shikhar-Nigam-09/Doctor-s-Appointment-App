import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData } = useContext(DoctorContext)
  const { currencySymbol } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
    }
  }, [dToken])

  return (
    dashData && (
      <div className="p-6 space-y-8">
        {/* ================= TOP STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Earnings */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            {/* Icon placeholder */}
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
              ₹
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-800">
                {currencySymbol}{dashData.earnings}
              </p>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
              📅
            </div>

            <div>
              <p className="text-sm text-gray-500">Appointments</p>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.appointments}
              </p>
            </div>
          </div>

          {/* Patients */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-xl font-bold">
              👥
            </div>

            <div>
              <p className="text-sm text-gray-500">Patients</p>
              <p className="text-2xl font-semibold text-gray-800">
                {dashData.patients}
              </p>
            </div>
          </div>
        </div>

        {/* ================= LATEST APPOINTMENTS ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-lg font-semibold text-gray-800 mb-4">
            Latest Appointments
          </p>

          {/* Desktop list */}
          <div className="hidden sm:block space-y-4">
            {dashData.latestAppointments.map(item => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.userData.image}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.userData.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Booking on {item.slotDate.replaceAll('_', '-')} at {item.slotTime}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full
                    ${
                      item.isCompleted
                        ? 'bg-green-100 text-green-600'
                        : item.cancelled
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  `}
                >
                  {item.isCompleted
                    ? 'Completed'
                    : item.cancelled
                    ? 'Cancelled'
                    : 'Pending'}
                </span>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-4">
            {dashData.latestAppointments.map(item => (
              <div
                key={item._id}
                className="p-4 rounded-xl bg-gray-50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={item.userData.image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="font-medium text-gray-800">
                    {item.userData.name}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {item.slotDate.replaceAll('_', '-')} · {item.slotTime}
                </p>

                <span
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded-full
                    ${
                      item.isCompleted
                        ? 'bg-green-100 text-green-600'
                        : item.cancelled
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  `}
                >
                  {item.isCompleted
                    ? 'Completed'
                    : item.cancelled
                    ? 'Cancelled'
                    : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  )
}

export default DoctorDashboard