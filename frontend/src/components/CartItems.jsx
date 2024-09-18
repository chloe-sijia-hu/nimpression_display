import React, { useContext, useEffect } from 'react'
import { CompanyContext } from '../Context/CompanyContext'
import {TbTrash} from "react-icons/tb"

const CartItems = () => {

    const { getTotalCartAmount, userBookings = [], fetchUserBooking, cartItems, removeFromCart } = useContext(CompanyContext);
    
    useEffect(() => {
        // Ensure userId is available and fetch bookings
        const token = localStorage.getItem('auth-token');
        if (token) {

            const fetchUserId = async () => {
                try {
                  const response = await fetch('http://localhost:4000/api/users/me', {
                    headers: {
                      'Authorization': `Bearer ${token}`,  // Correct token format
                    },
                  });
              
                  if (!response.ok) {
                    const errorText = await response.text();
                    if (response.status === 403) {
                      console.error('Token expired or invalid. Redirecting to login.');
                      // Redirect to login or refresh token logic
                      window.location.href = '/login';
                    }
                    console.error('Error response:', errorText);
                    return;
                  }
              
                  const data = await response.json();
                  fetchUserBooking(data.id); // Fetch bookings for the user
                } catch (error) {
                  console.error('Error fetching user ID:', error);
                }
              };
              
        }
    }, [fetchUserBooking]);

    return (
        <section className='max_padd_container pt-28'> 
            <table className='w-full mx-auto'>
                <thead>
                    <tr className='bg-slate-900/10 regular-18 sm:regular-22 text-start py-12'>
                        <th className='p-1 py-2'>Booking ID</th>
                        <th className='p-1 py-2'>Delivery Information</th>
                        <th className='p-1 py-2'>Pakage Information</th>
                        <th className='p-1 py-2'>Sender</th>
                        <th className='p-1 py-2'>Receiver</th>
                        <th className='p-1 py-2'>Date</th>
                        <th className='p-1 py-2'>Actions</th>
                    </tr>
                </thead>
                
                <tbody>
                    {userBookings.length > 0 ? (
                        userBookings.map((booking) => (
                            <tr key={booking.id} className='border-b border-slate-900/20 text-gray-30 p-6 medium-14 text-center'>
                                <td><div className='line-clamp-3'>{booking.origin}</div></td>
                                <td>${booking.destination}</td>
                                <td>
                                    {/* Your other content */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No bookings found</td>
                        </tr>
                    )}
                


{/*                     
                        {userBookings.length > 0 ? (
                            userBookings.map((booking) => (
                                <li key={booking.id}>
                                    <div>Origin: {booking.origin}</div>
                                    <div>Destination: {booking.destination}</div>
                                    {/* Add other booking details here */}
                                {/* </li> */}
                            {/* )) */}
                        {/* ) : (
                            <p>No bookings found</p>
                        )}
                     */} 

                    {/* {allbookings.map((booking, i) => (
                        <tr key={i} className='border-b border-slate-900/20 text-gray-20 p-6 medium-14'>
                        {/* <td><div className='line-clamp-3'>{truck.name}</div></td> */}
                        {/* <td>{booking.id}</td>
                        <td>Send from {booking.origin} to {booking.destination}</td>
                        <td>Category: {booking.category}, dimensions: {booking.length} * {booking.width} * {booking.height} cm, weight {booking.weight} kg, value ${booking.value}</td>
                        <td>{booking.senderName} {booking.senderCompany} {booking.senderEmail} {booking.senderPhone} {booking.senderReference}</td>
                        <td>{booking.receiverName} {booking.receiverCompany} {booking.receiverEmail} {booking.receiverPhone}</td>
                        <td>{new Date(booking.sendingDate).toLocaleDateString('en-GB')}</td> */}
                        {/* <td>{truck.capacity} m³</td> */}
                        {/* <td>{truck.available ? "Available" : "Unavailable"}</td> */}
                        {/* action section */}
                        {/* <td className='p-2 flex justify-center items-center'>
                            <div className='flex flex-row gap-x-2'>
                            <TbEdit className='cursor-pointer' onClick={() => handleEditClick(booking)} />
                            <TbTrash className='cursor-pointer' onClick={() => remove_booking(booking.id)} />
                            </div>
                        </td>
                        </tr> */}
                    {/* ))} */}
                </tbody>
            </table>
            {/* cart details */}
            <div className='flex flex-col gap-20 my-16 p-8 md:flex-row rounded-md bg-white w-full max-w-[666px]'>
                <div className='flex flex-col gap-10'>
                    <h4 className='bold-20'>Summary</h4>
                    <div>
                        <div className='flexBetween py-4'>
                            <h4 className='medium-16'>Subtotal:</h4>
                            <h4 className='text-gray-30 font-semibold'>${getTotalCartAmount()}</h4>
                        </div>
                        <hr />
                        <div className='flexBetween py-4'>
                            <h4 className='medium-16'>Assistance Fee:</h4>
                            <h4 className='text-gray-30 font-semibold'>To be confirmed</h4>
                        </div>
                        <hr />
                        <div className='flexBetween py-4'>
                            <h4 className='bold-18'>Total:</h4>
                            <h4 className='bold-18'>${getTotalCartAmount()}</h4>
                        </div>
                    </div>
                    <button className='btn_dark_rounded w-44'>Confirm</button>
                    <div className='flex flex-col gap-10 '>
                        <h4 className='bold-20 capitalize'>Your coupon code enter here:</h4>
                        <div className='flexBetween pl-5 h-12 bg-primary rounded-full ring-1 ring-slate-900/10'>
                            <input type="text" placeholder='Coupon code' className='bg-transparent border-none outline-none'/>
                            <button className='btn_dark_rounded'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartItems