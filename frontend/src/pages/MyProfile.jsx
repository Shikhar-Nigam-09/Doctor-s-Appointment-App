import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {

  const [isEdit, setIsEdit] = useState(false)
  const [image,setImage]=useState(false)

  const {userData,setUserData,token, backendURL, loadUserProfileData }=useContext(AppContext)


  const updateUserProfileData=async()=>{
    try {
      const formData=new FormData()

      formData.append('name',userData.name)
      formData.append('phone',userData.phone)

      formData.append('address',JSON.stringify(userData.address))

      formData.append('gender',userData.gender)


      formData.append('dob',userData.dob)

      image && formData.append('image',image)

      const {data}=await axios.post(backendURL+'/api/user/update-profile',formData, {headers:{token:token}})


      if(data.success)
      {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  return userData && (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* ===== PROFILE CARD ===== */}
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">

           <div className="relative w-32 h-32">
  {isEdit ? (
    <label htmlFor="image" className="cursor-pointer">
      <img
        className="w-32 h-32 rounded-2xl object-cover opacity-75"
        src={image ? URL.createObjectURL(image) : userData.image}
        alt="profile"
      />

      {/* Upload icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
        <img
          src={image? '':assets.upload_icon}  // 👈 put your upload icon here
          alt="upload"
          className="w-8 h-8"
        />
      </div>

      <input
        type="file"
        id="image"
        hidden
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
    </label>
  ) : (
    <img
      className="w-32 h-32 rounded-2xl object-cover"
      src={userData.image}
      alt="profile"
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

          {/* ===== CONTENT ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">

            {/* ===== CONTACT INFO ===== */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Contact Information
              </p>

              <div className="space-y-4 text-sm">

                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="text-primary">{userData.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Phone</p>
                  {isEdit ? (
                    <input
                      className="border rounded-lg px-3 py-2 w-full"
                      value={userData.phone}
                      onChange={e =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-700">{userData.phone}</p>
                  )}
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Address</p>
                  {isEdit ? (
  <div className="space-y-2">
    <input
      className="border rounded-lg px-3 py-2 w-full"
      value={userData.address?.line1 || ""}
      onChange={e =>
        setUserData({
          ...userData,
          address: { ...userData.address, line1: e.target.value }
        })
      }
    />
    <input
      className="border rounded-lg px-3 py-2 w-full"
      value={userData.address?.line2 || ""}
      onChange={e =>
        setUserData({
          ...userData,
          address: { ...userData.address, line2: e.target.value }
        })
      }
    />
  </div>
) : (
  <p className="text-gray-700 leading-5">
    {userData.address?.line1 || ""}<br />
    {userData.address?.line2 || ""}
  </p>
)}
                </div>

              </div>
            </div>

            {/* ===== BASIC INFO ===== */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Basic Information
              </p>

              <div className="space-y-4 text-sm">

                <div>
                  <p className="text-gray-500 mb-1">Gender</p>
                  {isEdit ? (
                    <select
                      className="border rounded-lg px-3 py-2 w-full"
                      value={userData.gender}
                      onChange={e =>
                        setUserData({ ...userData, gender: e.target.value })
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  ) : (
                    <p className="text-gray-700">{userData.gender}</p>
                  )}
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Date of Birth</p>
                  {isEdit ? (
                    <input
                      type="date"
                      className="border rounded-lg px-3 py-2 w-full"
                      value={userData.dob}
                      onChange={e =>
                        setUserData({ ...userData, dob: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-gray-700">{userData.dob}</p>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* ===== ACTIONS ===== */}
          <div className="flex justify-end mt-10">
            {isEdit ? (
              <button
                onClick={updateUserProfileData}
                className="px-8 py-2 bg-[#5f6FFF] text-white rounded-full hover:opacity-90"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-8 py-2 border rounded-full hover:bg-gray-100"
              >
                Edit Profile
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default MyProfile

