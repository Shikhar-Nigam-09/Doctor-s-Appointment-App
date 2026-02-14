import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[#F6F7FB] mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-gray-600">

          {/* ----- Left Section ----- */}
          <div>
            <img
              src={assets.logo}
              alt="Prescripto logo"
              className="w-40 mb-5"
            />
            <p className="leading-6">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s.
            </p>
          </div>

          {/* ----- Center Section ----- */}
          <div>
            <p className="font-semibold text-gray-900 mb-5 tracking-wide">
              COMPANY
            </p>
            <ul className="space-y-3">
              <li>
                <NavLink
                  to="/"
                  className="hover:text-[#5f6FFF] transition"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-[#5f6FFF] transition"
                >
                  About us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-[#5f6FFF] transition"
                >
                  Contact us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacy-policy"
                  className="hover:text-[#5f6FFF] transition"
                >
                  Privacy policy
                </NavLink>
              </li>
            </ul>
          </div>

          {/* ----- Right Section ----- */}
          <div>
            <p className="font-semibold text-gray-900 mb-5 tracking-wide">
              GET IN TOUCH
            </p>
            <ul className="space-y-3">
              <li className="hover:text-gray-800 transition">
                +91 8218543576
              </li>
              <li className="hover:text-gray-800 transition">
                prescripto@gmail.com
              </li>
            </ul>
          </div>

        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Prescripto. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer