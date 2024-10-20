import React from 'react'
import Sidebar from '../components/Sidebar'
import {Routes, Route} from 'react-router-dom'
import AddTruck from '../components/AddTruck'
import ListTruck from '../components/ListTruck'
import ListBooking from '../components/ListBooking'
import AdminDashboard from '../components/AdminDashboard'
import Login from '../components/Login'
import ListSubscription from '../components/ListSubscription'
import UserManagement from '../components/UserManagement'
// import Login from '../../../frontend/src/pages/Login';

const Admin = () => {
  return (
    <div className='lg:flex'>
      <Sidebar />
      <Routes>
        <Route path='/addtruck' element={<AddTruck />}/>
        <Route path='/listtruck' element={<ListTruck />}/>
        <Route path='/listbooking' element={<ListBooking />}/>
        <Route path='/' element={<AdminDashboard />}/>
        <Route path='/dashboard' element={<AdminDashboard />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/subscription" element={<ListSubscription />} />
        <Route path="/allusers" element={<UserManagement />} />
      </Routes>
    </div>
  )
}

export default Admin