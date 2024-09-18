
import React, { useEffect, useState } from 'react';
import { TbTrash, TbEdit } from "react-icons/tb";
import EditBooking from './EditBooking';
// import EditTruck from './EditTruck'; // Import EditTruck component

const ListBooking = () => {
  const [allbookings, setAllbookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // State to track selected booking

  const fetchInfo = async () => {
    await fetch('http://localhost:4000/api/bookings/allbookings').then((res) => res.json()).then((data) => { setAllbookings(data) });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_booking = async (id) => {
    await fetch('http://localhost:4000/api/bookings/removebooking', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    });
    await fetchInfo(); // Refresh the list after deletion
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleBackToList = () => {
    setSelectedBooking(null);
  };

  const handleEditSuccess = () => {
    fetchInfo(); // Fetch the updated list after successful edit
    setSelectedBooking(null); // Return to the list view
  };



  return (
    <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-5 lg:ml-5'>
      {selectedBooking ? (
        <div>
          <h4 className='bold-22 p-5 uppercase'>Edit Booking</h4>
          {/* Render EditBooking with selected booking */}
          <EditBooking booking={selectedBooking} onBack={handleBackToList} onEditSuccess={handleEditSuccess} />
        </div>
      ) : ( 
        <div><h4 className='bold-22 p-5 uppercase'>Booking List</h4>
        <div className='max-h-[77vh] overflow-auto px-4 text-center'>
          <table className='w-full mx-auto'>
            <thead>
              <tr className='bg-primary bold-14 sm:regular-22 text-start py-12'>
                <th className='p-2'>Booking ID</th>
                <th className='p-2'>Delivery Information</th>
                <th className='p-2'>Pakage Information</th>
                <th className='p-2'>Sender</th>
                <th className='p-2'>Receiver</th>
                <th className='p-2'>Date</th>
                <th className='p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allbookings.map((booking, i) => (
                <tr key={i} className='border-b border-slate-900/20 text-gray-20 p-6 medium-14'>
                  {/* <td><div className='line-clamp-3'>{truck.name}</div></td> */}
                  <td>{booking.id}</td>
                  <td>Send from {booking.origin} to {booking.destination}</td>
                  <td>Category: {booking.category}, dimensions: {booking.length} * {booking.width} * {booking.height} cm, weight {booking.weight} kg, value ${booking.value}</td>
                  <td>{booking.senderName} {booking.senderCompany} {booking.senderEmail} {booking.senderPhone} {booking.senderReference}</td>
                  <td>{booking.receiverName} {booking.receiverCompany} {booking.receiverEmail} {booking.receiverPhone}</td>
                  <td>{new Date(booking.sendingDate).toLocaleDateString('en-GB')}</td>
                  {/* <td>{truck.capacity} m³</td> */}
                  {/* <td>{truck.available ? "Available" : "Unavailable"}</td> */}
                  {/* action section */}
                  <td className='p-2 flex justify-center items-center'>
                    <div className='flex flex-row gap-x-2'>
                      <TbEdit className='cursor-pointer' onClick={() => handleEditClick(booking)} />
                      <TbTrash className='cursor-pointer' onClick={() => remove_booking(booking.id)} />
                    </div>
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
};

export default ListBooking;
