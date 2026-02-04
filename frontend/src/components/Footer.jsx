import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-50 mt-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-gray-600">
        
        {/* ----- Left Section ----- */}
        <div>
          <img src={assets.logo} alt="Prescripto logo" className="w-40 mb-4" />
          <p className="leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s.
          </p>
        </div>

        {/* ----- Center Section ----- */}
        <div>
          <p className="font-semibold text-gray-900 mb-4">COMPANY</p>
          <ul className="space-y-2">
            <li>
              <NavLink to="/" className="hover:text-primary">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about" className="hover:text-primary">About us</NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="hover:text-primary">Contact us</NavLink>
            </li>
            <li>
              <NavLink to="/privacy-policy" className="hover:text-primary">Privacy policy</NavLink>
            </li>
          </ul>
        </div>

        {/* ----- Right Section ----- */}
        <div>
          <p className="font-semibold text-gray-900 mb-4">GET IN TOUCH</p>
          <ul className="space-y-2">
            <li>+91 8218543576</li>
            <li>prescripto@gmail.com</li>
          </ul>
        </div>

      </div>

      {/* Bottom line */}
      <div className="border-t text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Prescripto. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
