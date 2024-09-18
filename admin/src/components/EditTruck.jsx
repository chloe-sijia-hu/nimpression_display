import React from 'react';
import upload_area from '../assets/upload_area.png';
import { useState } from 'react';

// There are two ways to carete Edit Truck page, conditional rendering or pop up window. 
// I use conditional rendering for a better looking.

const EditTruck = ({ truck, onBack, onEditSuccess }) => {
  const [image, setImage] = useState(false);  // Initialize with the existing truck image
  const [truckDetails, setTruckDetails] = useState(truck);

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

    // Check if a new image is uploaded
    if (truck.imageFile) {
        let formData = new FormData();
        formData.append('truck', truck.imageFile);

        await fetch('http://localhost:4000/api/trucks/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => { responseData = data });

        if (!responseData.success) {
            alert("Image upload failed");
            return;
        }

        truck.image = responseData.image_url;  // Update with the new image URL
    } else {
        truck.image = truck.image; // Use the existing image URL if no new image is uploaded
    }

    // Proceed with the truck edit
    await fetch('http://localhost:4000/api/trucks/edittruck', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(truck),
    }).then((resp) => resp.json()).then((data) => {
        data.success ? alert("Truck Edited Successfully!") : alert("Upload Failed");
        onEditSuccess();
    });
};



      
  return (
    <div className='p-8 box-border bg-white w-full rounded-sm mt-1 lg:ml-5'>
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