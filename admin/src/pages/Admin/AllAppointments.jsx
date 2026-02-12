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
    <div className="w-full max-w-6xl m-5">
      <p className="mb-4 text-lg font-medium text-gray-800">
        All Appointments
      </p>

      <div className="bg-white border rounded-xl shadow-sm text-sm max-h-[80vh] overflow-y-auto">
        {/* HEADER */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                        gap-3 py-3 px-6 border-b bg-gray-50
                        font-medium text-gray-600 sticky top-0 z-10">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p className="text-center">Actions</p>
        </div>

        {/* ROWS */}
        {appointments.map((item, index) => (
          <div
            key={item._id}
            className="flex flex-col sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr]
                       gap-3 items-start sm:items-center py-4 px-6 border-b
                       text-gray-500 hover:bg-gray-50 transition-all duration-200"
          >
            {/* INDEX */}
            <p className="max-sm:hidden">{index + 1}</p>

            {/* PATIENT */}
            <div className="flex items-center gap-3">
              <img
                className="w-9 h-9 rounded-full object-cover"
                src={item.userData.image}
                alt=""
              />
              <p className="font-medium text-gray-800">
                {item.userData.name}
              </p>
            </div>

            {/* AGE */}
            <p className="max-sm:hidden">
              {calculateAge(item.userData.dob)}
            </p>

            {/* DATE */}
            <p>
              {item.slotDate}, {item.slotTime}
            </p>

            {/* DOCTOR */}
            <div className="flex items-center gap-3">
              <img
                className="w-9 h-9 rounded-full bg-gray-200"
                src={item.docData.image}
                alt=""
              />
              <p className="font-medium text-gray-700">
                {item.docData.name}
              </p>
            </div>

            {/* FEES */}
            <p className="font-medium">
              {currency}{item.amount}
            </p>

            {/* ACTION */}
            <div className="flex justify-center">
              {item.cancelled ? (
                <span className="text-red-500 font-medium text-sm">
                  Cancelled
                </span>
              ) : (
                <button
                  disabled={loadingId === item._id}
                  onClick={() => cancelAppointment(item._id)}
                  className={`w-9 h-9 flex items-center justify-center
                    rounded-full border transition-all duration-200
                    ${
                      loadingId === item._id
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-red-50 hover:border-red-400"
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