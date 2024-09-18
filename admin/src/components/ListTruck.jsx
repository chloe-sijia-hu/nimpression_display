import React, { useEffect, useState } from 'react';
import { TbTrash, TbEdit } from "react-icons/tb";
import EditTruck from './EditTruck'; // Import EditTruck component

const ListTruck = () => {
  const [alltrucks, setAlltrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState(null); // State to track selected truck

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/trucks/alltrucks');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAlltrucks(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_truck = async (id) => {
    await fetch('http://localhost:4000/api/trucks/removetruck', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
    });
    await fetchInfo(); // Refresh the list after deletion
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
      {selectedTruck ? (
        <div>
          <h4 className='bold-22 p-5 uppercase'>Edit Trucks</h4>
          {/* Render EditTruck with selected truck */}
          <EditTruck truck={selectedTruck} onBack={handleBackToList} onEditSuccess={handleEditSuccess} />
        </div>
      ) : ( 
        <div><h4 className='bold-22 p-5 uppercase'>Trucks List</h4>
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
                
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
};

export default ListTruck;
