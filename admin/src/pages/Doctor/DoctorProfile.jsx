import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const {
    dToken,
    profileData,
    setProfileData,
    getProfileData
  } = useContext(DoctorContext)

  const { backendURL, currencySymbol } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [fees, setFees] = useState('')
  const [address, setAddress] = useState({ line1: '', line2: '' })
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    if (dToken) {
      getProfileData()
    }
  }, [dToken])

  useEffect(() => {
    if (profileData) {
      setFees(profileData.fees)
      setAddress(profileData.address)
      setAvailable(profileData.available)
    }
  }, [profileData])

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(
        backendURL + '/api/doctor/update-profile',
        {
          fees,
          address,
          available
        },
        { headers: { dtoken: dToken } }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  if (!profileData) return null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ================= PROFILE CARD ================= */}
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image */}
          <div className="shrink-0">
            <img
              src={profileData.image}
              alt=""
              className="w-44 h-44 rounded-2xl object-cover bg-gray-100"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">
              {profileData.name}
            </h2>

            <p className="text-gray-500">
              {profileData.degree} · {profileData.speciality}
            </p>

            <span className="inline-block text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600">
              {profileData.experience}
            </span>

            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              {profileData.about}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gray-100" />

        {/* ================= DETAILS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fees */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Appointment Fee</p>

            {isEdit ? (
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 outline-none"
              />
            ) : (
              <p className="font-medium text-gray-800">
                {currencySymbol}{profileData.fees}
              </p>
            )}
          </div>

          {/* Availability */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Availability</p>

            {isEdit ? (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={available}
                  onChange={() => setAvailable(!available)}
                  className="accent-green-600"
                />
                <span className="text-sm">
                  {available ? 'Available' : 'Unavailable'}
                </span>
              </label>
            ) : (
              <span
                className={`inline-block text-sm px-3 py-1 rounded-full
                  ${profileData.available
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'}
                `}
              >
                {profileData.available ? 'Available' : 'Unavailable'}
              </span>
            )}
          </div>

          {/* Address Line 1 */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Address Line 1</p>
            {isEdit ? (
              <input
                value={address.line1}
                onChange={(e) =>
                  setAddress({ ...address, line1: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl bg-gray-50 outline-none"
              />
            ) : (
              <p className="text-gray-800">{profileData.address.line1}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Address Line 2</p>
            {isEdit ? (
              <input
                value={address.line2}
                onChange={(e) =>
                  setAddress({ ...address, line2: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl bg-gray-50 outline-none"
              />
            ) : (
              <p className="text-gray-800">{profileData.address.line2}</p>
            )}
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="mt-8 flex gap-4">
          {isEdit ? (
            <>
              <button
                onClick={updateProfile}
                className="px-6 py-2 rounded-full bg-[#5f6FFF] text-white hover:opacity-90 transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => setIsEdit(false)}
                className="px-6 py-2 rounded-full bg-gray-100 text-gray-700"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-6 py-2 rounded-full bg-[#5f6FFF] text-white hover:opacity-90 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile