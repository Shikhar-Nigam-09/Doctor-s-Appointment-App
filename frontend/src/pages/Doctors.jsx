import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {
  const { speciality } = useParams()
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const [activeSpeciality, setActiveSpeciality] = useState(speciality || '')
  const [filteredDoctors, setFilteredDoctors] = useState([])

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatrician',
    'Neurologist',
    'Gastroenterologist',
  ]

  // ================= FILTER =================
  useEffect(() => {
    if (activeSpeciality) {
      setFilteredDoctors(
        doctors.filter(doc => doc.speciality === activeSpeciality)
      )
    } else {
      setFilteredDoctors(doctors)
    }
  }, [activeSpeciality, doctors])

  const handleSpecialityClick = (item) => {
    if (item === activeSpeciality) {
      setActiveSpeciality('')
      navigate('/doctors')
    } else {
      setActiveSpeciality(item)
      navigate(`/doctors/${item}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] py-8">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col md:flex-row gap-8">

          {/* ================= LEFT FILTER ================= */}
          <div className="md:w-1/4">
            <p className="mb-4 text-sm font-semibold text-gray-700">
              Browse by speciality
            </p>

            <div className="flex md:flex-col gap-3 flex-wrap">
              {specialities.map((item, index) => {
                const isActive = activeSpeciality === item

                return (
                  <button
                    key={index}
                    onClick={() => handleSpecialityClick(item)}
                    className={`
                      px-4 py-2 text-sm rounded-full
                      transition-all duration-300
                      ${
                        isActive
                          ? 'bg-[#5f6FFF] text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-[#EEF0FF]'
                      }
                    `}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ================= DOCTORS GRID ================= */}
          <div className="md:w-3/4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
            {filteredDoctors.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  if (!item.available) return
                  navigate(`/appointment/${item._id}`)
                }}
                className={`
                  bg-white rounded-3xl overflow-hidden
                  shadow-sm hover:shadow-lg
                  transition-all duration-300
                  ${
                    item.available
                      ? 'cursor-pointer hover:-translate-y-2'
                      : 'opacity-80 cursor-not-allowed'
                  }
                `}
              >
                <img
                  className="w-full h-44 object-top bg-blue-50"
                  src={item.image}
                  alt={item.name}
                />

                <div className="p-5">
                  {/* Availability */}
                  <div
                    className={`flex items-center gap-2 text-sm mb-1
                      ${item.available ? 'text-green-600' : 'text-red-500'}
                    `}
                  >
                    <span
                      className={`w-2 h-2 rounded-full
                        ${item.available ? 'bg-green-500' : 'bg-red-500'}
                      `}
                    ></span>
                    <p>{item.available ? 'Available' : 'Unavailable'}</p>
                  </div>

                  <p className="font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.speciality}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Doctors