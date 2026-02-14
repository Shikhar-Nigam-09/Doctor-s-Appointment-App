import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

/* ---------- Soft Field Wrapper ---------- */
const FieldBox = ({ label, children }) => (
  <div className="bg-[#F8F9FD] rounded-2xl p-4 shadow-sm">
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    {children}
  </div>
)

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const {
    userData,
    setUserData,
    token,
    backendURL,
    loadUserProfileData
  } = useContext(AppContext)

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      image && formData.append('image', image)

      const { data } = await axios.post(
        backendURL + '/api/user/update-profile',
        formData,
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    userData && (
      <div className="min-h-screen bg-[#F6F7FB] py-8">
        <div className="max-w-5xl mx-auto px-4">

          {/* ================= PROFILE CARD ================= */}
          <div className="bg-white rounded-3xl shadow-md p-6 sm:p-10">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">

              <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer">
                    <img
                      src={image ? URL.createObjectURL(image) : userData.image}
                      className="w-full h-full rounded-2xl object-cover opacity-80"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                      <img src={assets.upload_icon} className="w-7" />
                    </div>
                    <input
                      type="file"
                      hidden
                      id="image"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </label>
                ) : (
                  <img
                    src={userData.image}
                    className="w-full h-full rounded-2xl object-cover"
                    alt=""
                  />
                )}
              </div>

              <div className="text-center sm:text-left">
                <p className="text-2xl font-semibold text-gray-800">
                  {userData.name}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Patient Profile
                </p>
              </div>
            </div>

            {/* ================= DETAILS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              {/* CONTACT */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">
                  Contact Information
                </p>

                <FieldBox label="Email">
                  <p className="text-sm text-gray-700 break-all">
                    {userData.email}
                  </p>
                </FieldBox>

                <FieldBox label="Phone">
                  {isEdit ? (
                    <input
                      className="w-full bg-transparent outline-none text-sm"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{userData.phone}</p>
                  )}
                </FieldBox>

                <FieldBox label="Address">
                  {isEdit ? (
                    <div className="space-y-2">
                      <input
                        className="w-full bg-transparent outline-none text-sm"
                        placeholder="Address line 1"
                        value={userData.address?.line1 || ''}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            address: {
                              ...userData.address,
                              line1: e.target.value
                            }
                          })
                        }
                      />
                      <input
                        className="w-full bg-transparent outline-none text-sm"
                        placeholder="Address line 2"
                        value={userData.address?.line2 || ''}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            address: {
                              ...userData.address,
                              line2: e.target.value
                            }
                          })
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 leading-5">
                      {userData.address?.line1}<br />
                      {userData.address?.line2}
                    </p>
                  )}
                </FieldBox>
              </div>

              {/* BASIC */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">
                  Basic Information
                </p>

                <FieldBox label="Gender">
                  {isEdit ? (
                    <select
                      className="w-full bg-transparent outline-none text-sm"
                      value={userData.gender}
                      onChange={(e) =>
                        setUserData({ ...userData, gender: e.target.value })
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-700">{userData.gender}</p>
                  )}
                </FieldBox>

                <FieldBox label="Date of Birth">
                  {isEdit ? (
                    <input
                      type="date"
                      className="w-full bg-transparent outline-none text-sm"
                      value={userData.dob}
                      onChange={(e) =>
                        setUserData({ ...userData, dob: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{userData.dob}</p>
                  )}
                </FieldBox>
              </div>
            </div>

            {/* ================= ACTION ================= */}
            <div className="flex justify-end mt-10">
              {isEdit ? (
                <button
                  onClick={updateUserProfileData}
                  className="px-10 py-2.5 bg-[#5f6FFF] text-white rounded-full shadow-md hover:opacity-90 transition"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-10 py-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    )
  )
}

export default MyProfile