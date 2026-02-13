import React from 'react'
import Login from './pages/Login'
  

  import { ToastContainer} from 'react-toastify';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import {Route, Routes} from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const {aToken}=useContext(AdminContext)
  const {dToken}=useContext(DoctorContext)
  return aToken|| dToken ? (
    <div  className='bg-[#F8F9FD]'>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/*Admin Routes*/}
            <Route path='/' element={<></>}></Route>
            <Route path='/admin-dashboard' element={<Dashboard/>}></Route>
            <Route path='/all-appointments' element={<AllAppointments/>}></Route>
            <Route path='/add-doctor' element={<AddDoctor/>}></Route>
            <Route path='/doctor-list' element={<DoctorsList/>}></Route>

            {/*Doctor Routes*/}
            <Route path='/doctor-dashboard' element={<DoctorDashboard/>}></Route>
            <Route path='/doctor-appointment' element={<DoctorAppointment/>}></Route>
            <Route path='/doctor-profile' element={<DoctorProfile/>}></Route>


        </Routes>
      </div>
      
      
    </div>
  ): (
    <>
    <Login/>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
      />
      
    </>
  )
}

export default App