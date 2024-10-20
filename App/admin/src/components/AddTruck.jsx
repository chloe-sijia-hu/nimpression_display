import React from 'react'
import upload_area from '../assets/upload_area.png'
import { useState, useEffect } from 'react'

const AddTruck = () => {

    const [image, setImage] = useState(false);
    const [showAccessDenied, setShowAccessDenied] = useState(false);

    const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	

    const [truckDetails, setTruckDetails] = useState({
        name: "",
        image: "",
        long: "",
        wide: "",
        high: "",
        gcw: "",
        capacity: "",
        info: "",
        available: "true",  // Set the default value as "true"
    })

    useEffect(() => {
        checkAdminAccess();
      }, []);

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


    const imageHandler = (e) => {
        setImage(e.target.files[0])
    }

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setTruckDetails(prevDetails => ({
            ...prevDetails,
            [name]: name === "available" ? 
            (value === "true" ? true : false) : (name === "gcw" || name === "capacity" ? Number(value) : value)
        }));
    }
    
    const Add_Truck = async () => {
        const token = localStorage.getItem('auth-token');
        try {
            console.log(truckDetails);
            let responseData;
            let truck = truckDetails;
    
            let formData = new FormData();
            formData.append('truck', image);
    
            // Upload the image
            const imageResponse = await fetch(`${VITE_API_URL}/trucks/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });
    
            if (!imageResponse.ok) {
                throw new Error(`Image upload failed with status: ${imageResponse.status}`);
            }
    
            responseData = await imageResponse.json();
    
            if (responseData.success) {
                truck.image = responseData.image_url;
                console.log(truck);
                console.log("image url: ", responseData.image_url)
    
                // Add the truck
                const truckResponse = await fetch(`${VITE_API_URL}/trucks/addtruck`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(truck),
                });
    
                const truckData = await truckResponse.json();
                truckData.success ? alert("Truck Added Successfully!") : alert("Upload Failed");
            } else {
                alert("Image upload failed");
            }
        } catch (error) {
            console.error("Error adding truck:", error);
            alert("An error occurred while adding the truck: " + error.message);
        }
    };
    


  return (
    <div className='p-8 box-border bg-white w-full rounded-sm mt-5 lg:ml-5'>
      {showAccessDenied ? (
        <section className="max_padd_container flexCenter flex-col pt-3">
        <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto rounded-md">
          <h3 className="h3">Booking List</h3>
          <p className="pb-3">Access Denied. You do not have permission to view all bookings!</p>
        </div>
      </section>
      ) : (
        <div>
        <div className='mb-3'>
            <h4 className='bold-18 pb-2'>Truck Name:</h4>
            <input value={truckDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type the name here' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md' />
        </div>

        {/* long high wide */}
        <h4 className='bold-18 pb-2'>Dimensions (L x W x H m):</h4>
        <div className="flex flex-col gap-4 justify-start">
            <div className='flex flex-col gap-4'>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'>
                        <input value={truckDetails.long} onChange={changeHandler} type="number" name='long' placeholder='Long' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'>
                        <input value={truckDetails.wide} onChange={changeHandler} type="number" name='wide' placeholder='Wide' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'>
                        <input value={truckDetails.high} onChange={changeHandler} type="number" name='high' placeholder='High' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
            </div>
        </div>

        {/* GCW Capacity */}
        <div className="flex flex-col gap-4 justify-start">
            <div className='flex flex-col gap-4'>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-full'>
                        <h4 className='bold-18 pb-2'>GCW (kg):</h4>
                        <input value={truckDetails.gcw} onChange={changeHandler} type="number" name='gcw' placeholder='Gross Combined Weight' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-full'>
                        <h4 className='bold-18 pb-2'>Capcity (m³):</h4>
                        <input value={truckDetails.capacity} onChange={changeHandler} type="number" name='capacity' placeholder='Type here..' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
            </div>
        </div>

        <div className='mb-3'>
            <h4 className='bold-18 pb-2'>Information:</h4>
            <input value={truckDetails.info} onChange={changeHandler} type="text" name='info' placeholder='Class/Transmission types/details/...' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md' />
        </div>

        <div className="mb-3">
            <h4 className="bold-18 pb-2">Availablility:</h4>
            <select value={truckDetails.available} onChange={changeHandler} name="available" id="" className='bg-primary ring-1 ring-transparent medium-16 rounded-sm outline-none max-w-200 w-full py-3 px-4'>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
            </select>
        </div>

        <div className='mb-3'>
            <h4 className='bold-18 pb-2'>Photo:</h4>
            <div className='bg-primary outline-none max-w-50 w-full py-3 px-4 rounded-md'>
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload_area}  alt="" className="w-20 rounded-sm inline-block" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden className="bg-primary max-w-80 w-full py-3 px-4"/>
            </div>
        </div>
        <div>
            
        </div>
        <button onClick={() => Add_Truck()} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Add the Truck</button>
        </div>

      )}
    </div>

  );
}


export default AddTruck