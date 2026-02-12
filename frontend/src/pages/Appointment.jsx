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
      console.log(error)
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

  /* ================= 🔴 UNAVAILABLE GUARD ================= */
  if (docInfo && !docInfo.available) {
    return (
      <div className="md:mx-10 mt-20 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Doctor is currently unavailable
        </h2>
        <p className="text-gray-500 mt-2">
          Please check back later or choose another doctor
        </p>

        <button
          onClick={() => navigate('/doctors')}
          className="mt-6 px-6 py-3 bg-[#5f6FFF] text-white rounded-full"
        >
          Browse Doctors
        </button>
      </div>
    )
  }

  /* ================= UI ================= */
  return (
    docInfo && (
      <div className="md:mx-10 mt-10">
        {/* Doctor Details */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="md:w-56 flex">
            <img
              className="w-full h-full object-cover bg-[#5f6FFF] rounded-lg"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          <div className="flex-1 bg-white border rounded-xl p-6 flex flex-col">
            <p className="text-2xl font-semibold flex items-center gap-2">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="verified" />
            </p>

            <div className="flex items-center gap-3 mt-2">
              <p className="text-gray-600">
                {docInfo.degree} – {docInfo.speciality}
              </p>
              <button className="text-xs px-3 py-1 border rounded-full text-gray-600">
                {docInfo.experience}
              </button>
            </div>

            <div className="mt-6">
              <p className="flex items-center gap-2 font-medium text-gray-800">
                About
                <img className="w-4" src={assets.info_icon} alt="info" />
              </p>

              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {docInfo.about}
              </p>
            </div>

            <p className="mt-4">
              Appointment fee:{' '}
              <span>
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>

          {/* Dates */}
          <div className="flex gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded cursor-pointer
                ${
                  slotIndex === index
                    ? 'bg-[#5f6FFF] text-white'
                    : 'border border-gray-300'
                }`}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p className="text-lg font-semibold">
                  {item[0] && item[0].datetime.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex gap-3 flex-wrap mt-6">
            {docSlots[slotIndex]?.map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`text-sm px-5 py-2 rounded-full cursor-pointer
                ${
                  slotTime === item.time
                    ? 'bg-[#5f6FFF] text-white'
                    : 'border border-gray-300 text-gray-600'
                }`}
              >
                {item.time}
              </p>
            ))}
          </div>

          <button
            disabled={!slotTime}
            onClick={bookAppointment}
            className={`mt-6 px-8 py-3 rounded-full text-white font-medium transition-all
              ${
                slotTime
                  ? 'bg-[#5f6FFF] hover:scale-105'
                  : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Book Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  )
}

export default Appointment