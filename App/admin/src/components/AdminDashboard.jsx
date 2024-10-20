import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [allbookings, setAllbookings] = useState([]);
  const [bookingCounts, setBookingCounts] = useState({
    pending: 0,
    delivered: 0,
    unpaid: 0,
    process: 0,
  });
  const [paymentSummary, setPaymentSummary] = useState({
    paymentReceived: { total: 0, thisWeek: 0, thisMonth: 0 },
    paymentWaiting: { total: 0, thisWeek: 0, thisMonth: 0 },
  });
  const [selectedPeriod, setSelectedPeriod] = useState('total');
  const navigate = useNavigate();

	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
  const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.nimpression.site' || 'http://3.27.181.196:80'|| 'http://localhost:5173';
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	
  // Function to fetch and verify the user's role
  const checkAdminAccess = () => {
    const token = localStorage.getItem('auth-token');
    
    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role === 'admin') {
            setShowAccessDenied(false);
        } else {
            setShowAccessDenied(true);
            setTimeout(() => {
                navigate('/login'); // Redirect to login after 2 seconds
            }, 2000);
        }
    } else {
        setShowAccessDenied(true);
        setTimeout(() => {
            navigate('/login'); // Redirect to login after 2 seconds
        }, 2000);
    }
  };

  const fetchInfo = async () => {
    try {
      const token = localStorage.getItem('auth-token'); // Get token from localStorage
      const response = await fetch(`${VITE_API_URL}/bookings/allbookings`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send token in header
        },
        credentials: 'include',
      });

      if (response.status === 403) {
        // Token is invalid or expired
        alert('Your session has expired or you are not admin. Please log in again.');
        localStorage.removeItem('auth-token'); // Clear the token
        setTimeout(() => {
          navigate('/login'); // Redirect to login after a short delay
        }, 2000);
      } else if (response.status === 401) {
        // Handle no token or unauthorized access
        alert('Unauthorized. Please log in.');
        navigate('/login');
      } else {
        const data = await response.json();
        setAllbookings(data);
        countBookings(data); // Call the count function
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  // Function to count bookings by status
  const countBookings = (bookings) => {
    const counts = {
      pending: 0,
      delivered: 0,
      unpaid: 0,
      process: 0
    };

    const statusMapping = {
      'Pending': 'pending',
      'Delivered': 'delivered',
      'Wait for payment': 'unpaid',
      'Payment received. Order in process': 'process',
    };

    bookings.forEach((booking) => {
      const statusKey = statusMapping[booking.status];
      console.log("Booking status:", booking.status);
      if (statusKey) {
        counts[statusKey]++;
      }
    });
    console.log("Counts:", counts);
    setBookingCounts(counts); // Update state with counts
  };

  const fetchPaymentSummary = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`${VITE_API_URL}/bookings/payment-summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentSummary(data);
      } else if (response.status === 403) {
        setShowAccessDenied(true);
      } else {
        console.error('Failed to fetch payment summary');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    checkAdminAccess();  // Check for admin access on component mount
    fetchInfo();         // Fetch bookings
    fetchPaymentSummary(); // Fetch payment summary
  }, []);

  const getPaymentAmount = (type, period) => {
    return paymentSummary[type][period];
  };

  return (
    <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-5 lg:ml-5'>
      {showAccessDenied ? (
        <section className="max_padd_container flexCenter flex-col pt-3">
          <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto rounded-md">
            <h3 className="h3">Admin Dashboard</h3>
            <p className="pb-3">Access Denied. You do not have permission to view this page!</p>
          </div>
        </section>
      ) : (
        <div className='mx-5 px-5'>
          <h3 className="h3 pt-5">Admin Dashboard</h3>
          <p>Welcome admin. Here you can manage all the bookings and trucks.</p>
          
          {/* Updated Order Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div className="flex flex-col items-center p-4 border rounded-md bg-gradient-to-t from-slate-400/10 to-slate-400/40">
              <h5 className="font-bold mb-2">Paid and in Process Order</h5>
              <p className="text-2xl font-bold">{bookingCounts.process}</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-gradient-to-t from-slate-400/10 to-slate-400/40">
              <h5 className="font-bold mb-2">Approved but Unpaid Order</h5>
              <p className="text-2xl font-bold">{bookingCounts.unpaid}</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-gradient-to-t from-slate-400/10 to-slate-400/40">
              <h5 className="font-bold mb-2">Pending Order: Wait for Approval</h5>
              <p className="text-2xl font-bold">{bookingCounts.pending}</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-gradient-to-t from-slate-400/10 to-slate-400/40">
              <h5 className="font-bold mb-2">Delivered Order</h5>
              <p className="text-2xl font-bold">{bookingCounts.delivered}</p>
            </div>
          </div>

          {/* Payment Summary Section */}
          <div className="mt-10">
            <h4 className="text-xl font-bold mb-4">Payment Summary</h4>
            <div className="mb-4">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="total">Total</option>
                <option value="thisMonth">This Month</option>
                <option value="thisWeek">This Week</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded bg-gradient-to-t from-slate-400/10 to-slate-400/40">
                <h5 className="font-bold">Payment Received</h5>
                <p className="text-2xl font-bold">
                  ${getPaymentAmount('paymentReceived', selectedPeriod).toFixed(2)}
                </p>
              </div>
              <div className="p-4 border rounded bg-gradient-to-r from-slate-400/10 to-slate-400/40 ">
                <h5 className="font-bold">Payment Waiting</h5>
                <p className="text-2xl font-bold">
                  ${getPaymentAmount('paymentWaiting', selectedPeriod).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminDashboard;