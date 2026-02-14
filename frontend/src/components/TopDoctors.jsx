import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <div className="flex flex-col items-center gap-4 my-20 text-gray-900 md:mx-10 px-4">

      {/* ===== Heading ===== */}
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-semibold">
          Top Doctors to Book
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* ===== Doctors Grid ===== */}
      <div
        className="
          w-full mt-8
          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
          gap-6
        "
      >
        {doctors.slice(0, 10).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            className="
              bg-white rounded-2xl overflow-hidden
              shadow-sm hover:shadow-xl
              transition-all duration-300
              hover:-translate-y-2
              cursor-pointer
            "
          >
            {/* Doctor Image */}
            <img
              className="w-full h-44 object-cover object-top bg-blue-50"
              src={item.image}
              alt={item.name}
            />

            {/* Info */}
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-xs mb-2
                  ${item.available ? 'text-green-600' : 'text-red-500'}
                `}
              >
                <span
                  className={`w-2 h-2 rounded-full
                    ${item.available ? 'bg-green-500' : 'bg-red-500'}
                  `}
                />
                <p>{item.available ? 'Available' : 'Unavailable'}</p>
              </div>

              <p className="text-gray-900 text-base font-semibold">
                {item.name}
              </p>
              <p className="text-gray-500 text-sm">
                {item.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== CTA Button ===== */}
      <button
        onClick={() => {
          navigate('/doctors')
          scrollTo(0, 0)
        }}
        className="
          mt-12 px-12 py-3
          rounded-full
          bg-blue-50 text-gray-700
          text-sm font-medium
          hover:bg-[#5f6FFF] hover:text-white
          transition-all
        "
      >
        View All Doctors
      </button>
    </div>
  )
}

export default TopDoctors