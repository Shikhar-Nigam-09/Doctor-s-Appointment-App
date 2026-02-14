import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext)
  const [relDocs, setRelDocs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (speciality) {
      const related = doctors.filter(
        doc => doc.speciality === speciality && doc._id !== docId
      )
      setRelDocs(related)
    }
  }, [speciality, docId, doctors])

  return (
    <div className="mt-20">

      {/* ================= HEADING ================= */}
      <div className="text-center mb-10">
        <p className="text-2xl font-semibold text-gray-800">
          Related Doctors
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Simply browse through our extensive list of trusted doctors.
        </p>
      </div>

      {/* ================= DOCTORS GRID ================= */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        {relDocs.slice(0, 5).map((item) => (
          <div
            key={item._id}
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            className="
              bg-white rounded-3xl overflow-hidden
              shadow-sm hover:shadow-lg
              transition-all duration-300
              cursor-pointer hover:-translate-y-2
            "
          >
            <img
              className="w-full h-44 object-cover object-top bg-blue-50"
              src={item.image}
              alt={item.name}
            />

            <div className="p-5">
              {/* Availability */}
              <div className="flex items-center gap-2 text-sm text-green-600 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <p>Available</p>
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
  )
}

export default RelatedDoctors