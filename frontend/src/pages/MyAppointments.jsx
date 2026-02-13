import React, { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const MyAppointments = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

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

  // ================= RAZORPAY POPUP =================
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
          console.log(err)
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
      console.log(error)
      toast.error("Unable to start payment")
    }
  }

  // ================= EFFECT =================
  useEffect(() => {
    if (token) getUserAppointments()
  }, [token])

  // ================= UI =================
  return (
    <div className="md:mx-10 mt-10">
      <p className="text-2xl font-medium text-gray-800 mb-6">
        My Appointments
      </p>

      <div className="space-y-6">
        {appointments.map((item) => (
          <div
            key={item._id}
            className="flex flex-col sm:flex-row gap-6 items-start sm:items-center
                       border rounded-xl p-6 bg-white"
          >
            {/* Doctor Info */}
            <div className="flex gap-4 flex-1">
              <img
                className="w-24 h-24 rounded-lg object-cover bg-blue-50"
                src={item.docData.image}
                alt={item.docData.name}
              />

              <div className="text-sm text-gray-600">
                <p className="text-base font-medium text-gray-800">
                  {item.docData.name}
                </p>
                <p className="mb-2">{item.docData.speciality}</p>

                <p className="font-medium text-gray-700">Address:</p>
                <p>{item.docData.address.line1}</p>
                <p>{item.docData.address.line2}</p>

                <p className="mt-2">
                  <span className="font-medium text-gray-700">
                    Date & Time:
                  </span>{" "}
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 min-w-40">
              {/* PAID */}
              {item.payment && !item.isCompleted && (
                <button
                  disabled
                  className="border border-green-300 bg-green-100 text-green-700
                             py-2 rounded-lg text-sm cursor-not-allowed"
                >
                  Paid
                </button>
              )}

              {/* PAY NOW */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="border border-gray-300 text-gray-600 py-2 rounded-lg text-sm
                             transition-all hover:bg-[#5f6FFF] hover:text-white"
                >
                  Pay Now
                </button>
              )}

              {/* CANCEL */}
              {!item.cancelled && !item.payment && !item.isCompleted &&(
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="border border-gray-300 text-gray-600 py-2 rounded-lg text-sm
                             transition-all hover:bg-red-500 hover:text-white"
                >
                  Cancel appointment
                </button>
              )}

              {/* CANCELLED */}
              {item.cancelled && !item.isCompleted &&(
                <button
                  disabled
                  className="border border-gray-300 bg-gray-100 text-red-700
                             py-2 rounded-lg text-sm cursor-not-allowed"
                >
                  Appointment Cancelled
                </button>
              )}
              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">Completed</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments