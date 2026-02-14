import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-20 text-gray-800"
    >
      {/* ================= HEADING ================= */}
      <div className="text-center max-w-xl px-4">
        <h1 className="text-3xl font-semibold">
          Find by Speciality
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Simply browse through our extensive list of trusted doctors,
          schedule your appointment hassle-free.
        </p>
      </div>

      {/* ================= SPECIALITY SCROLLER ================= */}
      <div
        className="
          w-full mt-8
          flex gap-6 px-6
          overflow-x-auto no-scrollbar
          sm:justify-center
        "
      >
        {specialityData.map((item, index) => (
          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="
              flex flex-col items-center
              min-w-24 sm:min-w-30
              bg-white rounded-3xl
              p-4 sm:p-5
              shadow-sm hover:shadow-lg
              transition-all duration-300
              hover:-translate-y-2
              cursor-pointer
            "
          >
            <img
              className="w-14 sm:w-20 mb-3"
              src={item.image}
              alt={item.speciality}
            />
            <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu