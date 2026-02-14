import React, { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"

const MyAppointments = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])

  // ================= FETCH APPOINTMENTS =================
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendURL + "/api/user/appointments",
        { headers: { token } }
      )

      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load appointments")
    }
  }

  // ================= CANCEL APPOINTMENT =================
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        await getDoctorsData()
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Cancel failed")
    }
  }

  // ================= RAZORPAY =================
  const initPay = (order, appointmentId) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Doctor Appointment",
      description: "Appointment Payment",
      order_id: order.id,
      handler: async function (response) {
        try {
          const verify = await axios.post(
            backendURL + "/api/user/verify-razorpay",
            {
              appointmentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            },
            { headers: { token } }
          )

          if (verify.data.success) {
            toast.success("Payment successful")
            getUserAppointments()
          } else {
            toast.error("Payment verification failed")
          }
        } catch (err) {
          toast.error("Payment verification error")
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  // ================= START PAYMENT =================
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      )

      if (data.success) {
        initPay(data.order, appointmentId)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Unable to start payment")
    }
  }

  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#F6F7FB] py-8">
      <div className="max-w-5xl mx-auto px-4">

        <p className="text-2xl font-semibold text-gray-800 mb-6">
          My Appointments
        </p>

        <div className="space-y-6">
          {appointments.map((item) => (
            <div
              key={item._id}
              className="
                bg-white rounded-3xl p-5 sm:p-6
                shadow-sm hover:shadow-md
                transition
                flex flex-col sm:flex-row
                gap-6
              "
            >
              {/* ================= DOCTOR INFO ================= */}
              <div className="flex gap-4 flex-1">
                <img
                  className="w-24 h-24 rounded-2xl object-cover bg-blue-50"
                  src={item.docData.image}
                  alt={item.docData.name}
                />

                <div className="text-sm text-gray-600 space-y-1">
                  <p className="text-base font-semibold text-gray-800">
                    {item.docData.name}
                  </p>
                  <p>{item.docData.speciality}</p>

                  <div className="mt-2 bg-[#F8F9FD] rounded-xl p-3">
                    <p className="font-medium text-gray-700 text-xs mb-1">
                      Address
                    </p>
                    <p>{item.docData.address.line1}</p>
                    <p>{item.docData.address.line2}</p>
                  </div>

                  <p className="mt-2">
                    <span className="font-medium text-gray-700">
                      Date & Time:
                    </span>{" "}
                    {item.slotDate} | {item.slotTime}
                  </p>
                </div>
              </div>

              {/* ================= ACTIONS ================= */}
              <div className="flex flex-col gap-3 sm:min-w-45">

                {item.payment && !item.isCompleted && (
                  <button
                    disabled
                    className="
                      bg-green-100 text-green-700
                      py-2 rounded-full text-sm
                      cursor-not-allowed
                    "
                  >
                    Paid
                  </button>
                )}

                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="
                      bg-[#F6F7FB] text-gray-700
                      py-2 rounded-full text-sm
                      hover:bg-[#5f6FFF] hover:text-white
                      transition
                    "
                  >
                    Pay Now
                  </button>
                )}

                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="
                      bg-[#F6F7FB] text-gray-700
                      py-2 rounded-full text-sm
                      hover:bg-red-500 hover:text-white
                      transition
                    "
                  >
                    Cancel Appointment
                  </button>
                )}

                {item.cancelled && !item.isCompleted && (
                  <button
                    disabled
                    className="
                      bg-red-100 text-red-600
                      py-2 rounded-full text-sm
                      cursor-not-allowed
                    "
                  >
                    Appointment Cancelled
                  </button>
                )}

                {item.isCompleted && (
                  <button
                    disabled
                    className="
                      bg-green-100 text-green-600
                      py-2 rounded-full text-sm
                      cursor-not-allowed
                    "
                  >
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))}

          {appointments.length === 0 && (
            <p className="text-center text-gray-400 py-20">
              No appointments found
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAppointments