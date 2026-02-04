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
    <div className="mt-16">

      {/* Heading */}
      <p className="text-xl font-medium text-center">
        Related Doctors
      </p>
      <p className="text-sm text-center text-gray-600 mt-1 mb-6">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Doctors Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {relDocs.slice(0, 5).map((item) => (
          <div
            key={item._id}
            onClick={() => {navigate(`/appointment/${item._id}`),scrollTo(0,0)}}
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

export default RelatedDoctors
