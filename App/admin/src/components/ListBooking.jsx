import React, { useEffect, useState } from 'react';
import { TbTrash, TbEdit } from "react-icons/tb";
import EditBooking from './EditBooking';
import { useNavigate } from 'react-router-dom';
// import EditTruck from './EditTruck'; // Import EditTruck component

const ListBooking = () => {
  const [allbookings, setAllbookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // State to track selected booking
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    id: '',
    origin: '',
    destination: '',
    category: '',
    status: '',
    senderName: '',
    receiverName: '',
    sendingDate: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

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
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  

  useEffect(() => {
    checkAdminAccess();  // Check for admin access on component mount
    fetchInfo();         // Fetch bookings
  }, []);

  const remove_booking = async (id) => {
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
          await fetchInfo(); // Refresh the list after deletion
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
    fetchInfo(); // Fetch the updated list after successful edit
    setSelectedBooking(null); // Return to the list view
  };

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
  
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = (bookings) => {
    return bookings.filter(booking => {
      return Object.keys(filters).every(key => {
        if (!filters[key]) return true; // if filter is empty, include all
        if (key === 'sendingDate') {
          return booking[key].includes(filters[key]);
        }
        return booking[key].toString().toLowerCase().includes(filters[key].toLowerCase());
      });
    });
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedBookings = React.useMemo(() => {
    let sortableItems = [...applyFilters(allbookings)];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [allbookings, sortConfig, filters]);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    // <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-5 lg:ml-5'>
    <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-5 lg:ml-5 lg:max-w-[1440px] mx-auto'>
      {showAccessDenied ? (
        <section className="max_padd_container flexCenter flex-col pt-3">
        <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto rounded-md">
          <h3 className="h3">Booking List</h3>
          <p className="pb-3">Access Denied. You do not have permission to view all bookings!</p>
        </div>
      </section>
      ) : (
        selectedBooking ? (
        <div>
          <h4 className='bold-22 p-5 uppercase ml-7'>Edit Booking</h4>
          {/* Render EditBooking with selected booking */}
          <EditBooking booking={selectedBooking} onBack={handleBackToList} onEditSuccess={handleEditSuccess} />
        </div>
      ) : ( 
        <div>
        <h4 className='bold-22 p-5 uppercase'>Booking List</h4>
        <p className='p-5'>
          As an admin, you can edit or delete any pending bookings. 
          However, when the booking status is not pending, you can only edit limited details. 
          Please exercise caution when changing the booking status.
        </p>
        <div className='mb-4 grid grid-cols-4 gap-4'>
          <input
            type="text"
            placeholder="Filter by ID"
            name="id"
            value={filters.id}
            onChange={handleFilterChange}
            className='p-2 border rounded ml-4'
          />
          <input
            type="text"
            placeholder="Filter by Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className='p-2 border rounded'
          />
          <input
            type="text"
            placeholder="Filter by Origin"
            name="origin"
            value={filters.origin}
            onChange={handleFilterChange}
            className='p-2 border rounded'
          />
          <input
            type="text"
            placeholder="Filter by Destination"
            name="destination"
            value={filters.destination}
            onChange={handleFilterChange}
            className='p-2 border rounded mr-6'
          />
        </div>
        <p className='p-2 ml-2'>
          Showing {indexOfFirstBooking + 1} - {Math.min(indexOfLastBooking, sortedBookings.length)} of {sortedBookings.length} bookings
        </p>
        <div className='max-h-[77vh] overflow-auto px-4 text-center'>
          <table className='w-full mx-auto'>
            <thead>
              <tr className='bg-primary bold-14 sm:regular-22 text-start py-12'>
                {['id', 'status', 'sendingDate', 'origin', 'destination', 'category', 'duration', 'deliveryFee'].map((key) => (
                  <th key={key} className='p-2 cursor-pointer' onClick={() => requestSort(key)}>
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    {sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : ' ▾'}
                  </th>
                ))}
                <th className='p-2'>Package Information</th>
                <th className='p-2'>Sender</th>
                <th className='p-2'>Receiver</th>
                <th className='p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking, i) => (
                <tr key={i} className={`border-b border-slate-900/20 ${booking.status === 'Delivered' ? 'text-gray-10' : 'text-gray-20'} p-6 medium-14`}>
                  <td>{booking.id}</td>
                  <td>{booking.status}</td>
                  <td>{new Date(booking.sendingDate).toLocaleDateString('en-GB')}</td>
                  <td>{booking.origin}</td>
                  <td>{booking.destination}</td>
                  <td>{booking.category.charAt(0).toUpperCase() + booking.category.slice(1)}</td>
                  <td>{formatDuration(booking.duration)}</td>
                  <td>${booking.deliveryFee}</td>
                  <td>
                    <p className={`${booking.status === 'Delivered' ? 'text-gray-10' : 'text-gray-20'}`}>Dimensions: {booking.length} * {booking.width} * {booking.height} cm,</p> 
                    <p className={`${booking.status === 'Delivered' ? 'text-gray-10' : 'text-gray-20'}`}>weight {booking.weight} kg,</p>
                    <p className={`${booking.status === 'Delivered' ? 'text-gray-10' : 'text-gray-20'}`}>value ${booking.value}</p>
                  </td>
                  <td>{booking.senderName} {booking.senderCompany} {booking.senderEmail} {booking.senderPhone} {booking.senderReference}</td>
                  <td>{booking.receiverName} {booking.receiverCompany} {booking.receiverEmail} {booking.receiverPhone}</td>
                  <td className='p-2 flex justify-center items-center'>
                    <div className='flex flex-row gap-x-2'>
                      {booking.status !== 'Delivered' && (
                        <TbEdit className='cursor-pointer' onClick={() => handleEditClick(booking)} />
                      )}
                      {booking.status === 'Pending' && (
                        <TbTrash className='cursor-pointer' onClick={() => remove_booking(booking.id)} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          bookingsPerPage={bookingsPerPage}
          totalBookings={sortedBookings.length}
          paginate={paginate}
          currentPage={currentPage}
        />
        </div>
      // selectedBooking ? 
      ) 
    // showAccessDenied   
    )}
    </div>
  // return
  );
};

const Pagination = ({ bookingsPerPage, totalBookings, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBookings / bookingsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="flex justify-center">
        {pageNumbers.map(number => (
          <li key={number} className="mx-1">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ListBooking;
