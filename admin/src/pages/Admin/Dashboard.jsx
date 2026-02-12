import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";


const StatCard = ({ title, value }) => {
  return (
    <div
      className="bg-white rounded-2xl p-6
                 shadow-sm hover:shadow-lg
                 transition-all duration-300
                 hover:-translate-y-1"
    >
      <p className="text-sm text-gray-500 tracking-wide">
        {title}
      </p>

      <p className="mt-2 text-3xl font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
};

const Dashboard = () => {
  const { aToken, dashData, getDashData } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) getDashData();
  }, [aToken]);

  if (!dashData) return null;

  return (
    <div className="m-6 w-full space-y-8">
      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Doctors" value={dashData.doctors} />
        <StatCard title="Appointments" value={dashData.appointments} />
        <StatCard title="Patients" value={dashData.patients} />
      </div>

      {/* ===== LATEST APPOINTMENTS ===== */}
      <div
        className="bg-white rounded-2xl p-6
                   shadow-sm hover:shadow-md
                   transition"
      >
        <p className="text-lg font-semibold text-gray-800 mb-5">
          Latest Appointments
        </p>

        <div className="space-y-4">
          {dashData.latestAppointments.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between
                         p-4 rounded-xl
                         bg-slate-50 hover:bg-slate-100
                         transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.docData.image}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover shadow"
                />

                <div>
                  <p className="font-medium text-gray-800">
                    {item.docData.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Booking on {item.slotDate}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              {item.cancelled ? (
                <span className="px-3 py-1 rounded-full
                                 text-xs font-medium
                                 bg-red-100 text-red-600">
                  Cancelled
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full
                                 text-xs font-medium
                                 bg-green-100 text-green-600">
                  Active
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;