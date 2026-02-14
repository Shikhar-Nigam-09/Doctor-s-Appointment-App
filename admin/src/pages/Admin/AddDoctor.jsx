import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'

/* ---------------- Helper Components ---------------- */

const SoftInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className="
        w-full rounded-xl bg-[#F6F7FB]
        px-4 py-2.5 text-sm
        focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]/30
        transition
      "
    />
  </div>
)

const SoftSelect = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <select
      {...props}
      className="
        w-full rounded-xl bg-[#F6F7FB]
        px-4 py-2.5 text-sm
        focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]/30
        transition
      "
    >
      {options.map((opt, i) => (
        <option key={i}>{opt}</option>
      ))}
    </select>
  </div>
)

/* ---------------- Main Component ---------------- */

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General Physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const { backendURL, aToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (!docImg) {
        toast.error('Image not selected')
        return
      }

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', fees)
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append(
        'address',
        JSON.stringify({ line1: address1, line2: address2 })
      )

      const { data } = await axios.post(
        backendURL + '/api/admin/add-doctor',
        formData,
        { headers: { atoken: aToken } }
      )

      if (data.success) {
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setAbout('')
        setFees('')
        setDegree('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#F6F7FB] px-4 py-6 sm:p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">
        Add Doctor
      </h1>

      <form
        onSubmit={onSubmitHandler}
        className="
          bg-white rounded-2xl
          shadow-[0_8px_30px_rgba(0,0,0,0.04)]
          p-6 sm:p-8
          max-w-5xl mx-auto
        "
      >
        {/* Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-10">
          <label
            htmlFor="doc-img"
            className="
              w-24 h-24 flex items-center justify-center
              rounded-full bg-[#F6F7FB]
              cursor-pointer hover:bg-[#EEF0FF]
              transition
            "
          >
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
              className="w-9 opacity-70"
            />
          </label>

          <input
            type="file"
            id="doc-img"
            hidden
            onChange={(e) => setDocImg(e.target.files[0])}
          />

          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-gray-700">
              Upload doctor picture
            </p>
            <p className="text-xs text-gray-400">
              JPG or PNG, max 2MB
            </p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div className="space-y-5">
            <SoftInput
              label="Your name"
              placeholder="Doctor name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <SoftInput
              label="Your Email"
              placeholder="Doctor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <SoftInput
              label="Password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <SoftSelect
              label="Experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              options={[
                '1 Year', '2 Years', '3 Years', '5 Years',
                '6 Years', '7 Years', '8 Years', '9 Years', '10 Years'
              ]}
            />
            <SoftInput
              label="Fees"
              placeholder="Doctor fees"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
            />
          </div>

          <div className="space-y-5">
            <SoftSelect
              label="Speciality"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              options={[
                'General Physician',
                'Dermatologist',
                'Gynecologist',
                'Pediatricians',
                'Neurologist',
                'Gastroenterologist'
              ]}
            />
            <SoftInput
              label="Education"
              placeholder="Education"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            />
            <SoftInput
              label="Address"
              placeholder="Address line 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
            <SoftInput
              label="Address 2"
              placeholder="Address line 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>
        </div>

        {/* About */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About doctor
          </label>
          <textarea
            rows="4"
            placeholder="Write a short description about the doctor"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="
              w-full rounded-xl bg-[#F6F7FB]
              px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#5f6FFF]/30
              transition
            "
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="
            mt-8 w-full sm:w-auto
            bg-[#5f6FFF] text-white
            px-10 py-2.5 rounded-full text-sm font-medium
            shadow-md hover:shadow-lg hover:opacity-80
            transition
          "
        >
          Add doctor
        </button>
      </form>
    </div>
  )
}

export default AddDoctor