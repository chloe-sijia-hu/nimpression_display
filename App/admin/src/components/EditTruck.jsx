import React from 'react';
import upload_area from '../assets/upload_area.png';
import { useState } from 'react';

// There are two ways to carete Edit Truck page, conditional rendering or pop up window. 
// I use conditional rendering for a better looking.

const EditTruck = ({ truck, onBack, onEditSuccess }) => {
  const [image, setImage] = useState(false);  // Initialize with the existing truck image
  const [truckDetails, setTruckDetails] = useState(truck);
  
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
        }
    } else {
        setShowAccessDenied(true);
    }
  };

  // Handle image change
  const imageHandler = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage)); // Update preview with the new image
      setTruckDetails((prevDetails) => ({
        ...prevDetails,
        imageFile: selectedImage, // Store the selected file for uploading later
      }));
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setTruckDetails(prevDetails => ({
      ...prevDetails,
      [name]: name === "available" ? 
      (value === "true" ? true : false) : (name === "gcw" || name === "capacity" ? Number(value) : value)
    }));
  };
    

  const Edit_Truck = async () => {
    console.log(truckDetails);
    let responseData = { success: true }; // Initialize with default success
    let truck = truckDetails;

    console.log("Edit_Truck truck.imageFile: ", truck.imageFile)

    // Check if a new image is uploaded
    if (truck.imageFile) {
        let formData = new FormData();
        formData.append('truck', truck.imageFile);
        // formData.append("image", truck.imageFile); // Append the file with the name 'image'
        // formData.append("otherField1", truck.otherField1); // Add any additional fields

        try {
            const token = localStorage.getItem('auth-token');
            console.log("VITE_API_URL:", VITE_API_URL);
            const response = await fetch(`${VITE_API_URL}/trucks/upload`, {
                method: "POST",
                credentials: 'include',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            responseData = await response.json();
            console.log("Server response:", responseData);
        } catch (error) {
            console.error("Error during file upload:", error);
        }
    

        truck.image = responseData.image_url;  // Update with the new image URL
    } else {
        console.log("No new image uploaded,curren image: ", truck.image);
        truck.image = truck.image; // Use the existing image URL if no new image is uploaded
    }

    // Proceed with the truck edit
    await fetch(`${VITE_API_URL}/trucks/edittruck`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify(truck),
    }).then((resp) => resp.json()).then((data) => {
        data.success ? alert("Truck Edited Successfully!") : alert("Upload Failed");
        onEditSuccess();
    });
};



      
  return (
    <div className='p-8 box-border bg-white w-auto rounded-sm mt-1 lg:ml-5'>
    {/* <div className='p-2 box-border bg-slate-300 mb-0 rounded-sm w-full mt-5 lg:ml-5'> */}
        <div className='mb-1'>
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
                    <img src={image ? image : truck.image ? truck.image : upload_area} alt="" className="w-20 rounded-sm inline-block" />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden className="bg-primary max-w-80 w-full py-3 px-4"/>
            </div>
        </div>
        <div>
            
        </div>
        <div className='flex gap-x-3'>
            <button onClick={() => Edit_Truck()} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Save</button>
            <button onClick={onBack} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Back to List</button>
        </div>
    </div>
    // </div>
  )
}


export default EditTruck