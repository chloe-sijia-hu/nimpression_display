import React, { useContext, useEffect, useState } from 'react'
import { CompanyContext } from '../Context/CompanyContext'
import { TbTrash, TbEdit } from "react-icons/tb";
import { IoWallet, IoWalletOutline } from "react-icons/io5";
import { BiLoaderCircle } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import CartEdit from './CartEdit';

const CartItems = () => {

    const { userBookings, fetchUserBookings, userId } = useContext(CompanyContext);
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [selectedBooking, setSelectedBooking] = useState(null); // State to track selected booking
    const [refresh, setRefresh] = useState(false); 
	const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';

    useEffect(() => {
      const token = localStorage.getItem('auth-token');
      if (!token) {
          setIsLoggedIn(false);
          setShowModal(true);
      } else {
          setIsLoggedIn(true);
          setShowModal(false);
          if (userId) {
              fetchUserBookings(userId); // Fetch bookings when the user is logged in
          }
      }
  }, [fetchUserBookings, userId, refresh]);
    
    const redirectToLogin = () => {
        navigate("/login");
      };

    // Function to update booking status
    const handlePayment = async (bookingId) => {
      const confirmPayment = window.confirm("Please make a payment via bank transfer: \n00-0000-0000000-000, \nNimpression Ltd. \nYour Reference: Booking ID. \n\nHave you completed the payment?");
      if (confirmPayment) {
          try {
              // Make an API call to update the booking status to 'Paid'
              const response = await fetch(`${VITE_API_URL}/bookings/editbooking`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      id: bookingId, // Pass the booking ID
                      status: 'Paid' // Update status to 'Paid'
                  }),
              });
  
              const data = await response.json();
              if (data.success) {
                  alert("Payment confirmed and booking status updated! \nYour order is now in process.");
                  // window.location.reload(); // Refresh the page to see the updated status
                  setRefresh(prev => !prev); 
              } else {
                  alert("Failed to update booking status.");
              }
          } catch (error) {
              console.error('Error confirming payment:', error);
              alert("An error occurred while confirming payment.");
          }
      }
  };
  




    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
        
        // Proceed only if the user confirmed the deletion
        if (confirmDelete) {
          try {
            const response = await fetch(`${VITE_API_URL}/bookings/removebooking`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: id })
            });
      
            if (response.ok) {
              console.log("Booking deleted successfully");
              window.location.reload(); 
            } else {
              console.log("Error deleting the booking");
            }
          } catch (error) {
            console.error("An error occurred while deleting the booking:", error);
          }
        } else {
          console.log("Booking deletion cancelled");
        }
      };

    const handleEditClick = (booking) => {
        setSelectedBooking(booking);
    };
    
    const handleBackToList = () => {
        setSelectedBooking(null);
    };
    
    const handleEditSuccess = () => {
        fetchUserBookings(); // Fetch updated bookings after edit
        window.location.reload(); // Fetch the updated list after successful edit
        setSelectedBooking(null); // Return to the list view
    };

    return (
        <>
        {showModal && (
          <section className="max_padd_container flexCenter flex-col pt-32 pb-5">
            <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto px-14 py-10 rounded-md">
              <h3 className="h3">Booking History</h3>
              <p className="pb-3">To check your booking, please login</p>
              <button className="btn_secondary_rounded my-6 w-full !rounded-md" onClick={redirectToLogin}>Login</button>
            </div>
          </section>
        )}
  
        {!showModal && (
            selectedBooking ? (
                <div className="max_padd_container pt-28 pb-5">
                {/* <h4 className='bold-22 p-5 uppercase pt-28 pb-5'>Edit Booking</h4> */}
                {/* Render CartEdit  with selected booking */}
                <CartEdit booking={selectedBooking} onBack={handleBackToList} onEditSuccess={handleEditSuccess} />
              </div>
            ) : ( 

                <section className='max_padd_container flexCenter flex-col pt-28 pb-5'> 
                <div className='h-auto flex flex-col py-10 px-14 rounded-md bg-white'>
                    <h3 className="h3 text-left">My Booking History</h3>
                    {/* <p className="mb-2">Bank Transfer: 00-0000-0000000-000, Nimpression Ltd. Reference: Booking ID</p> */}
                    <p className="">You can edit/delete your booking when it's in pending status.</p>
                    <p className="mb-2">Please make payment AFTER it has been checked by our staff.</p>
                
                        <table className='mx-auto'>
                            <thead>
                                <tr className='bg-slate-900/10 regular-18 sm:regular-22 text-start py-12'>
                                    <th className='p-1 py-2'>Booking ID</th>
                                    <th className='p-1 py-2'>Booking Status</th>
                                    <th className='p-1 py-2'>Delivery Information</th>
                                    <th className='p-1 py-2'>Pakage Information</th>
                                    <th className='p-1 py-2'>Sender</th>
                                    <th className='p-1 py-2'>Receiver</th>
                                    <th className='p-1 py-2'>Date</th>
                                    <th className='p-1 py-2'>
                                        Fee
                                        <div className='text-xs'>(GST Included)</div>
                                    </th>
                                    <th className='p-1 py-2'>Actions</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {userBookings.length > 0 ? (
                                    userBookings.map((booking) => (
                                        <tr key={booking.id} className={`border-b border-slate-900/20 p-6 medium-14 text-center h-auto w-auto ${booking.status === 'Delivered' ? 'text-gray-10' : 'text-gray-30'}`}>
                                            <td>
                                                <div className='line-clamp-3'>{booking.id}</div>
                                            </td>
                                            <td>{booking.status}</td>
                                            <td>
                                                <div className='line-clamp-3 '>{booking.origin} → {booking.destination}</div>
                                            </td>
                                            <td>Category: {booking.category}, dimensions: {booking.length} * {booking.width} * {booking.height} cm, weight {booking.weight} kg, value ${booking.value}</td>
                                            <td>
                                                {booking.senderName} {booking.senderCompany} {booking.senderEmail} {booking.senderPhone} {booking.senderReference}
                                            </td>
                                            <td>
                                                {booking.receiverName} {booking.receiverCompany} {booking.receiverEmail} {booking.receiverPhone}
                                            </td>
                                            <td>{new Date(booking.sendingDate).toLocaleDateString('en-GB')}</td>
                                            <td>${booking.deliveryFee}</td>
                                            <td className='p-2 flex justify-center items-center'>
                                                <div className='flex flex-row gap-x-2 '>
                                                {booking.status === 'Pending' ? (
                                                <>
                                                    <div className='flex items-center gap-x-1 cursor-pointer' onClick={() => handleEditClick(booking)}>
                                                    <TbEdit />
                                                    <span>Edit</span>
                                                    </div>
                                                    <div className='flex items-center gap-x-1 cursor-pointer' onClick={() => handleDelete(booking.id)}>
                                                    <TbTrash />
                                                    <span>Delete</span>
                                                    </div>
                                                </>
                                                ) : booking.status === 'Wait for payment' ? (
                                                    <div className='flex items-center gap-x-1 cursor-pointer' onClick={() => handlePayment(booking.id)}>
                                                        <IoWalletOutline />
                                                        <span>Pay</span>
                                                    </div>
                                                ) : booking.status === 'Paid' ? (
                                                    <div className='flex items-center gap-x-1 cursor-pointer'>
                                                        <IoWallet />
                                                        <span>Paid</span>
                                                    </div>
                                                ) : booking.status === 'Payment received. Order in process' ? (
                                                    <div className='flex items-center gap-x-1 cursor-pointer'>
                                                        <BiLoaderCircle />
                                                        <span>In Process</span>
                                                    </div>
                                                ) : booking.status === 'Delivered' && (
                                                    <div className='flex items-center gap-x-1 cursor-pointer'>
                                                        <TiTick />
                                                        <span>Delivered</span>
                                                    </div>
                                                )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">It looks like you don't have any bookings yet. Try refreshing the page to see if that helps!</td>
                                    </tr>
                                )}
                            
                            </tbody>
                        </table>
                    </div>
                </section>
            )
    )
}

  </>
   
  )
}

export default CartItems