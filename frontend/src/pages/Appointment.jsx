import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {
  const navigate = useNavigate()
  const { docId } = useParams()

  const {
    doctors,
    currencySymbol,
    backendURL,
    token,
    getDoctorsData,
  } = useContext(AppContext)

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  /* ================= FETCH DOCTOR ================= */
  const fetchDocInfo = () => {
    const info = doctors.find(doc => doc._id === docId)
    setDocInfo(info)
  }

  /* ================= GET AVAILABLE SLOTS ================= */
  const getAvailableSlots = async () => {
    setDocSlots([])

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        )
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()
        const slotDate = day + '_' + month + '_' + year

        const isSlotBooked =
          docInfo?.slots_booked?.[slotDate]?.includes(formattedTime)

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          })
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => [...prev, timeSlots])
    }
  }

  /* ================= BOOK APPOINTMENT ================= */
  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to Book Appointment')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    if (!slotTime) return

    try {
      const date = docSlots[slotIndex][0].datetime
      const slotDate =
        date.getDate() +
        '_' +
        (date.getMonth() + 1) +
        '_' +
        date.getFullYear()

      const { data } = await axios.post(
        backendURL + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Appointment booking failed')
    }
  }

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) getAvailableSlots()
  }, [docInfo])

  /* ================= UNAVAILABLE ================= */
  if (docInfo && !docInfo.available) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-gray-700">
          Doctor is currently unavailable
        </h2>
        <p className="text-gray-500 mt-2">
          Please check back later or choose another doctor
        </p>

        <button
          onClick={() => navigate('/doctors')}
          className="mt-6 px-8 py-3 bg-[#5f6FFF] text-white rounded-full shadow-md"
        >
          Browse Doctors
        </button>
      </div>
    )
  }

  /* ================= UI ================= */
  return (
    docInfo && (
      <div className="min-h-screen bg-[#F6F7FB] py-8">
        <div className="max-w-6xl mx-auto px-4">

          {/* ================= DOCTOR CARD ================= */}
          <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col md:flex-row gap-6">

            <div className="md:w-56">
              <img
                className="w-full h-64 md:h-full object-cover object-top rounded-2xl bg-[#EEF0FF]"
                src={docInfo.image}
                alt={docInfo.name}
              />
            </div>

            <div className="flex-1 space-y-4">
              <p className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                {docInfo.name}
                <img className="w-5" src={assets.verified_icon} alt="verified" />
              </p>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <p>
                  {docInfo.degree} – {docInfo.speciality}
                </p>
                <span className="px-3 py-1 bg-[#F6F7FB] rounded-full">
                  {docInfo.experience}
                </span>
              </div>

              <div className="bg-[#F8F9FD] rounded-2xl p-4">
                <p className="font-medium text-gray-800 flex items-center gap-2 mb-1">
                  About
                  <img className="w-4" src={assets.info_icon} alt="info" />
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {docInfo.about}
                </p>
              </div>

              <p className="font-medium text-gray-700">
                Appointment fee:{' '}
                <span className="text-gray-900">
                  {currencySymbol}{docInfo.fees}
                </span>
              </p>
            </div>
          </div>

          {/* ================= BOOKING ================= */}
          <div className="mt-8 bg-white rounded-3xl shadow-sm p-6">
            <p className="font-semibold text-gray-700 mb-4">
              Booking Slots
            </p>

            {/* Dates */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {docSlots.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSlotIndex(index)}
                  className={`min-w-16 py-4 rounded-xl text-center cursor-pointer transition
                    ${
                      slotIndex === index
                        ? 'bg-[#5f6FFF] text-white'
                        : 'bg-[#F6F7FB] text-gray-600 hover:bg-[#EEF0FF]'
                    }`}
                >
                  <p className="text-xs">
                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                  </p>
                  <p className="text-lg font-semibold">
                    {item[0] && item[0].datetime.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="flex gap-3 flex-wrap mt-6">
              {docSlots[slotIndex]?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`px-5 py-2 rounded-full text-sm transition
                    ${
                      slotTime === item.time
                        ? 'bg-[#5f6FFF] text-white'
                        : 'bg-[#F6F7FB] text-gray-600 hover:bg-[#EEF0FF]'
                    }`}
                >
                  {item.time}
                </button>
              ))}
            </div>

            <button
              disabled={!slotTime}
              onClick={bookAppointment}
              className={`mt-6 px-10 py-3 rounded-full font-medium transition
                ${
                  slotTime
                    ? 'bg-[#5f6FFF] text-white hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Book Appointment
            </button>
          </div>

          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    )
  )
}

export default Appointment