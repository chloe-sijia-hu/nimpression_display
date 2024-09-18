import React from 'react'
import Sidebar from '../components/Sidebar'
import {Routes, Route} from 'react-router-dom'
import AddTruck from '../components/AddTruck'
import ListTruck from '../components/ListTruck'
import ListBooking from '../components/ListBooking'

const Admin = () => {
  return (
    <div className='lg:flex'>
      <Sidebar />
      <Routes>
        <Route path='/addtruck' element={<AddTruck />}/>
        <Route path='/listtruck' element={<ListTruck />}/>
        <Route path='/listbooking' element={<ListBooking />}/>
      </Routes>
    </div>
  )
}

export default Admin