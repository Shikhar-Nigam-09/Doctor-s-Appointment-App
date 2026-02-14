import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="min-h-screen bg-[#F6F7FB] py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* ===== ABOUT US ===== */}
        <div className="text-center mb-12">
          <p className="text-3xl font-semibold text-gray-800 tracking-wide">
            ABOUT <span className="text-[#5f6FFF]">US</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Who we are & what we stand for
          </p>
        </div>

        {/* ===== TOP SECTION ===== */}
        <div className="flex flex-col md:flex-row gap-10 items-center">

          {/* Image */}
          <div className="md:w-1/2">
            <img
              className="w-full rounded-3xl shadow-sm"
              src={assets.about_image}
              alt="About Prescripto"
            />
          </div>

          {/* Text */}
          <div className="md:w-1/2 space-y-4 text-sm text-gray-600 leading-relaxed">

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p>
                Welcome to <span className="font-medium text-gray-800">Prescripto</span>,
                your trusted partner in managing your healthcare needs conveniently and
                efficiently. At Prescripto, we understand the challenges individuals face
                when it comes to scheduling doctor appointments and managing their health
                records.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p>
                Prescripto is committed to excellence in healthcare technology. We
                continuously strive to enhance our platform, integrating the latest
                advancements to improve user experience and deliver superior service.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p>
                Whether you're booking your first appointment or managing ongoing care,
                Prescripto is here to support you every step of the way.
              </p>
            </div>

            <div className="bg-[#EEF0FF] rounded-3xl p-6">
              <p className="font-semibold text-gray-800 mb-1">
                Our Vision
              </p>
              <p>
                Our vision at Prescripto is to create a seamless healthcare experience for
                every user. We aim to bridge the gap between patients and healthcare
                providers, making it easier for you to access the care you need, when you
                need it.
              </p>
            </div>
          </div>

        </div>

        {/* ===== WHY CHOOSE US ===== */}
        <div className="mt-20">

          <p className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Why Choose Us
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Card 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <p className="font-semibold text-gray-800 mb-2">
                Efficiency
              </p>
              <p className="text-sm text-gray-600">
                Streamlined appointment scheduling that fits perfectly into your busy
                lifestyle.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <p className="font-semibold text-gray-800 mb-2">
                Convenience
              </p>
              <p className="text-sm text-gray-600">
                Easy access to a trusted network of healthcare professionals near you.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <p className="font-semibold text-gray-800 mb-2">
                Personalization
              </p>
              <p className="text-sm text-gray-600">
                Smart recommendations and reminders designed around your health needs.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default About