import React, { useEffect, useState } from 'react';
import { TbTrash, TbEdit } from "react-icons/tb";
import EditTruck from './EditTruck'; // Import EditTruck component
import { useNavigate } from 'react-router-dom';

const ListTruck = () => {
  const [alltrucks, setAlltrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null); // State to track selected truck
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const navigate = useNavigate();
	
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
      const response = await fetch(`${VITE_API_URL}/trucks/alltrucks`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send token in header
        },
        credentials: 'include',
      });

      if (response.status === 403) {
        // Token is invalid or expired
        alert('has expired. Please log in again.');
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
        setAlltrucks(data);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    checkAdminAccess();  // Check for admin access on component mount
    fetchInfo();         // Fetch trucks
  }, []);

  const remove_truck = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this truck?");
    
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('auth-token');
        const response = await fetch(`${VITE_API_URL}/trucks/removetruck`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ id: id })
        });

        if (response.ok) {
          console.log("Truck deleted successfully");
          await fetchInfo(); // Refresh the list after successful deletion
        } else if (response.status === 403) {
          alert('Your session has expired. Please log in again.');
          localStorage.removeItem('auth-token');
          navigate('/login');
        } else {
          const errorData = await response.json();
          alert(`Failed to remove truck: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error removing truck:', error);
        alert('An error occurred while removing the truck.');
      }
    } else {
      console.log("Truck deletion cancelled");
    }
  };

  const handleEditClick = (truck) => {
    setSelectedTruck(truck);
  };

  const handleBackToList = () => {
    setSelectedTruck(null);
  };

  const handleEditSuccess = () => {
    fetchInfo(); // Fetch the updated list after successful edit
    setSelectedTruck(null); // Return to the list view
  };

  return (
    <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-5 lg:ml-5'>
      {showAccessDenied ? (
        <section className="max_padd_container flexCenter flex-col pt-3">
        <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto rounded-md">
          <h3 className="h3">Booking List</h3>
          <p className="pb-3">Access Denied. You do not have permission to view all bookings!</p>
        </div>
      </section>
      ) : (
        selectedTruck ? (
        <div>
          <h4 className='bold-22 p-5 uppercase'>Edit Trucks</h4>
          {/* Render EditTruck with selected truck */}
          <EditTruck truck={selectedTruck} onBack={handleBackToList} onEditSuccess={handleEditSuccess} />
        </div>
      ) : ( 
        <div><h4 className='bold-22 p-5 uppercase'>Trucks List</h4>
        <p className='p-5'>Only available trucks will be shown to customers.</p>
        <div className='max-h-[77vh] overflow-auto px-4 text-center'>
          <table className='w-full mx-auto'>
            <thead>
              <tr className='bg-primary bold-14 sm:regular-22 text-start py-12'>
                <th className='p-2'>Trucks</th>
                <th className='p-2'>Name</th>
                <th className='p-2'>Dimensions</th>
                <th className='p-2'>GCW</th>
                <th className='p-2'>Capacity</th>
                <th className='p-2'>Information</th>
                <th className='p-2'>Availability</th>
                <th className='p-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alltrucks.map((truck, i) => (
                <tr key={i} className='border-b border-slate-900/20 text-gray-20 p-6 medium-14'>
                  <td className='flexStart flexCenter'>
                    <img src={truck.image} alt="" height={43} width={43} className='rounded-lg ring-1 ring-slate-900/5 my-1 mt-4 flexCenter' />
                  </td>
                  <td><div className='line-clamp-3'>{truck.name}</div></td>
                  <td>{truck.long} * {truck.wide} * {truck.high} m</td>
                  <td>{truck.gcw} kg</td>
                  <td>{truck.capacity} m³</td>
                  <td>{truck.info}</td>
                  <td>{truck.available ? "Available" : "Unavailable"}</td>
                  {/* action section */}
                  <td className='p-2 flex justify-center items-center'>
                    <div className='flex flex-row gap-x-2'>
                      <TbEdit className='cursor-pointer' onClick={() => handleEditClick(truck)} />
                      <TbTrash className='cursor-pointer' onClick={() => remove_truck(truck.id)} />
                    </div>
                  </td>
                </tr>
              // {alltrucks.map
              ))} 
            </tbody>
          </table>
        </div>
        </div>
      ))}
    </div>
  );
};

export default ListTruck;
