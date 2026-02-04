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

  // Filter doctors whenever speciality changes
  useEffect(() => {
    if (activeSpeciality) {
      setFilteredDoctors(
        doctors.filter(doc => doc.speciality === activeSpeciality)
      )
    } else {
      setFilteredDoctors(doctors)
    }
  }, [activeSpeciality, doctors])

  // Handle speciality click (toggle logic)
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
    <div className="flex flex-col md:flex-row gap-8 mt-10 md:mx-10">

      {/* ================= LEFT SIDEBAR ================= */}
      <div className="md:w-1/4">
        <p className="mb-4 font-medium text-gray-700">
          Browse through the doctors specialist.
        </p>

        <div className="flex md:flex-col gap-3 flex-wrap">
          {specialities.map((item, index) => {
            const isActive = activeSpeciality === item

            return (
              <button
                key={index}
                onClick={() => handleSpecialityClick(item)}
                className={`
                  px-4 py-2 text-sm rounded-full border transition-all duration-300
                  ${isActive
                    ? 'bg-[#5f6FFF] text-white border-[#5f6FFF] font-semibold' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-[#5f6FFF]/10 hover:-translate-y-0.5'
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
      <div className="md:w-3/4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {filteredDoctors.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/appointment/${item._id}`)}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer
            hover:-translate-y-2 hover:shadow-lg transition-all duration-300"
          >
            <img className="bg-blue-50 w-full" src={item.image} alt={item.name} />

            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-green-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p>Available</p>
              </div>

              <p className="font-medium mt-1">{item.name}</p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Doctors
