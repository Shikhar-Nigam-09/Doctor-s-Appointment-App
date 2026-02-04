import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="md:mx-10 mt-10">

      {/* ===== ABOUT US ===== */}
      <div className="text-center mb-10">
        <p className="text-2xl font-medium text-gray-800">
          ABOUT <span className="text-primary">US</span>
        </p>
      </div>

      {/* ===== TOP SECTION ===== */}
      <div className="flex flex-col md:flex-row gap-8 items-center">

        {/* Image */}
        <div className="md:w-1/2">
          <img
            className="w-full rounded-lg"
            src={assets.about_image}
            alt="About Prescripto"
          />
        </div>

        {/* Text */}
        <div className="md:w-1/2 text-gray-600 text-sm leading-6">
          <p className="mb-4">
            Welcome to Prescripto, your trusted partner in managing your healthcare needs
            conveniently and efficiently. At Prescripto, we understand the challenges
            individuals face when it comes to scheduling doctor appointments and managing
            their health records.
          </p>

          <p className="mb-4">
            Prescripto is committed to excellence in healthcare technology. We continuously
            strive to enhance our platform, integrating the latest advancements to improve
            user experience and deliver superior service.
          </p>

          <p>
            Whether you&apos;re booking your first appointment or managing ongoing care,
            Prescripto is here to support you every step of the way.
          </p>

          <p className="mt-6 font-medium text-gray-800">
            Our Vision
          </p>

          <p className="mt-2">
            Our vision at Prescripto is to create a seamless healthcare experience for every
            user. We aim to bridge the gap between patients and healthcare providers, making
            it easier for you to access the care you need, when you need it.
          </p>
        </div>

      </div>

      {/* ===== WHY CHOOSE US ===== */}
      <div className="mt-16">

        <p className="text-xl font-medium text-gray-800 mb-6">
          WHY CHOOSE US
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="border rounded-lg p-6 hover:shadow-md transition-all">
            <p className="font-medium text-gray-800 mb-2">
              EFFICIENCY
            </p>
            <p className="text-sm text-gray-600">
              Streamlined appointment scheduling that fits into your busy lifestyle.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border rounded-lg p-6 hover:shadow-md transition-all">
            <p className="font-medium text-gray-800 mb-2">
              CONVENIENCE
            </p>
            <p className="text-sm text-gray-600">
              Access to a network of trusted healthcare professionals in your area.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border rounded-lg p-6 hover:shadow-md transition-all">
            <p className="font-medium text-gray-800 mb-2">
              PERSONALIZATION
            </p>
            <p className="text-sm text-gray-600">
              Tailored recommendations and reminders to help you stay on top of your health.
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}

export default About
