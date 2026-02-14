import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments } =
    useContext(AdminContext);
  const { calculateAge, backendURL, currency } =
    useContext(AppContext);

  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  // ================= CANCEL APPOINTMENT =================
  const cancelAppointment = async (appointmentId) => {
    try {
      setLoadingId(appointmentId);

      const { data } = await axios.post(
        backendURL + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { atoken: aToken } }
      );

      if (data.success) {
        toast.success("Appointment cancelled");
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Cancel failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <p className="mb-4 text-lg font-medium text-gray-800">
        All Appointments
      </p>

      <div className="bg-white rounded-xl shadow-sm text-sm max-h-[80vh] overflow-y-auto">
        {/* ================= DESKTOP HEADER ================= */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                        gap-3 py-3 px-6 bg-gray-50
                        font-medium text-gray-600 sticky top-0 z-10">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className="text-center">Actions</p>
        </div>

        {/* ================= ROWS ================= */}
        {appointments.map((item, index) => (
          <div
            key={item._id}
            className="flex flex-col sm:grid
                       sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                       gap-4 sm:gap-3
                       py-4 px-4 sm:px-6
                       border-b last:border-b-0
                       text-gray-600 hover:bg-gray-50
                       transition"
          >
            {/* INDEX (desktop only) */}
            <p className="hidden sm:block">{index + 1}</p>

            {/* PATIENT */}
            <div className="flex items-center gap-3">
              <img
                className="w-9 h-9 rounded-full object-cover"
                src={item.userData.image}
                alt=""
              />
              <div>
                <p className="font-medium text-gray-800">
                  {item.userData.name}
                </p>
                <p className="text-xs text-gray-400 sm:hidden">
                  Age: {calculateAge(item.userData.dob)}
                </p>
              </div>
            </div>

            {/* AGE (desktop only) */}
            <p className="hidden sm:block">
              {calculateAge(item.userData.dob)}
            </p>

            {/* DATE */}
            <p className="text-sm">
              {item.slotDate}, {item.slotTime}
            </p>

            {/* DOCTOR */}
            <div className="flex items-center gap-3">
              <img
                className="w-9 h-9 rounded-full bg-gray-200 object-cover"
                src={item.docData.image}
                alt=""
              />
              <p className="font-medium text-gray-700">
                {item.docData.name}
              </p>
            </div>

            {/* FEES */}
            <p className="font-medium text-gray-800">
              {currency}{item.amount}
            </p>

            {/* ACTION */}
            <div className="flex sm:justify-center">
              {item.cancelled ? (
                <span className="text-red-500 font-medium text-sm">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="text-green-500 font-medium text-sm">
                  Completed
                </span>
              ) : (
                <button
                  disabled={loadingId === item._id}
                  onClick={() => cancelAppointment(item._id)}
                  className={`w-10 h-10 flex items-center justify-center
                    rounded-full transition
                    ${
                      loadingId === item._id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-50"
                    }`}
                  title="Cancel appointment"
                >
                  <img
                    className="w-4"
                    src={assets.cancel_icon}
                    alt="cancel"
                  />
                </button>
              )}
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <p className="text-center py-10 text-gray-400">
            No appointments found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;