import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken,setAToken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')

    const [doctors,setDoctors]=useState([])

    const [appointments,setAppointments]=useState([])

    const [dashData, setDashData]=useState(false)

    const backendURL =import.meta.env.VITE_BACKEND_URL

    const getAllDoctors=async()=>{
        try{
            const {data}=await axios.post(backendURL+'/api/admin/all-doctors', {},{headers:{atoken: aToken}})
            if(data.success)
            {
                setDoctors(data.doctors)
                console.log(data.doctors);
            }else{
                toast.error(data.message)
            }
        }catch(error)
        {
            toast.error(error.message)

        }
    }

    const changeAvailability = async (docId) => {
    try {
      

      const { data } = await axios.post(
        backendURL + '/api/admin/change-availability',
        { docId },
        {
          headers: {
            atoken: aToken
          }
        }
      )

      if (data.success) {
        toast.success('Availability updated')
        getAllDoctors()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } 
  }

  const getAllAppointments=async()=>{
    try {
      
      const {data}=await axios.get(backendURL+'/api/admin/appointments',{headers:{atoken:aToken}})

      if(data.success){
        setAppointments(data.appointments)

      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDashData = async () => {
      try {
        const { data } = await axios.get(
          backendURL + "/api/admin/dashboard",
          { headers: { atoken: aToken } }
        );
  
        if (data.success) {
          setDashData(data.dashData);
        }
      } catch (error) {
        console.log(error);
      }
    };

  const value = {
    aToken,setAToken,backendURL,doctors,getAllDoctors,changeAvailability, appointments,setAppointments, getAllAppointments, dashData, getDashData
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider;
