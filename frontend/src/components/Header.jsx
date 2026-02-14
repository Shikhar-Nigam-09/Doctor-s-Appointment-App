import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="bg-[#5f6FFF] rounded-3xl px-6 md:px-10 lg:px-20 overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row items-center">

        {/* ================= LEFT ================= */}
        <div className="md:w-1/2 flex flex-col items-start justify-center gap-5 py-12 md:py-[10vw]">
          <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight">
            Book Appointment <br /> With Trusted Doctors
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-white text-sm">
            <img
              className="w-28"
              src={assets.group_profiles}
              alt=""
            />
            <p className="opacity-90 leading-6">
              Simply Browse through our extensive list of trusted Doctos,
              <br className="hidden sm:block" />
              schedule your appointment
            </p>
          </div>

          <a
            href="#speciality"
            className="
              inline-flex items-center gap-2
              bg-white text-gray-600
              px-10 py-3
              rounded-full text-sm font-medium
              shadow-md hover:shadow-lg
              hover:scale-105
              transition-all
            "
          >
            Book Appointment
            <img className="w-3" src={assets.arrow_icon} alt="" />
          </a>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="md:w-1/2 relative flex justify-center md:justify-end">
          <img
            className="
              w-full max-w-md
              md:absolute md:bottom-0
              object-contain
            "
            src={assets.header_img}
            alt=""
          />
        </div>

      </div>
    </div>
  )
}

export default Header