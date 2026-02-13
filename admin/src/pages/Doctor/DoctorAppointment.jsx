import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment
  } = useContext(DoctorContext)

  const { calculateAge, currencySymbol } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  const renderStatus = (item) => {
    if (item.isCompleted) {
      return (
        <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
          Completed
        </span>
      )
    }

    if (item.cancelled) {
      return (
        <span className="px-4 py-1 text-sm rounded-full bg-red-100 text-red-600 font-medium">
          Cancelled
        </span>
      )
    }

    return (
      <div className="flex justify-center gap-4">
        <button
          onClick={() => cancelAppointment(item._id)}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-red-50 hover:bg-red-100 transition"
          title="Cancel Appointment"
        >
          <img src={assets.cancel_icon} alt="Reject" className="w-5" />
        </button>

        <button
          onClick={() => completeAppointment(item._id)}
          className="w-11 h-11 rounded-full flex items-center justify-center bg-green-50 hover:bg-green-100 transition"
          title="Complete Appointment"
        >
          <img src={assets.tick_icon} alt="Accept" className="w-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <p className="text-xl font-semibold text-gray-800 mb-6">
        All Appointments
      </p>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[0.5fr_2fr_1fr_0.8fr_2fr_1fr_1.2fr] px-6 py-4 text-sm text-gray-500 font-medium bg-gray-50">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-center">Status</p>
        </div>

        {/* Rows */}
        {appointments.map((item, index) => (
          <div
            key={item._id}
            className="grid grid-cols-[0.5fr_2fr_1fr_0.8fr_2fr_1fr_1.2fr] px-6 py-5 items-center text-sm text-gray-700 border-t"
          >
            <p>{index + 1}</p>

            <div className="flex items-center gap-3">
              <img
                src={item.userData.image}
                className="w-11 h-11 rounded-full object-cover"
              />
              <p className="font-medium">{item.userData.name}</p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full w-fit
                ${item.payment
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-700'}
              `}
            >
              {item.payment ? 'Online' : 'Cash'}
            </span>

            <p>{calculateAge(item.userData.dob)}</p>

            <p className="text-gray-600">
              {item.slotDate.replaceAll('_', '-')} , {item.slotTime}
            </p>

            <p className="font-semibold">
              {currencySymbol}{item.amount}
            </p>

            <div className="flex justify-center">
              {renderStatus(item)}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {appointments.map(item => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-sm p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={item.userData.image}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {item.userData.name}
                </p>
                <p className="text-xs text-gray-500">
                  Age: {calculateAge(item.userData.dob)}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>Date: {item.slotDate.replaceAll('_', '-')}</p>
              <p>Time: {item.slotTime}</p>
              <p>Fees: {currencySymbol}{item.amount}</p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span
                className={`text-xs px-3 py-1 rounded-full
                  ${item.payment
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-700'}
                `}
              >
                {item.payment ? 'Online Payment' : 'Cash Payment'}
              </span>

              {renderStatus(item)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorAppointment