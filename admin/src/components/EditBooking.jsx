import React, { useState } from 'react';

const EditBooking = ({ booking, onBack, onEditSuccess }) => {

  const [bookingDetails, setBookingDetails] = useState({
    ...booking,
    sendingDate: booking.sendingDate ? new Date(booking.sendingDate).toISOString().split('T')[0] : '', // Convert to YYYY-MM-DD
  });

  // Handle form field changes
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setBookingDetails(prevDetails => ({
      ...prevDetails,
      [name]: value, // Update the correct field based on input name
    }));
  };

  const Edit_Booking = async () => {
    console.log(bookingDetails);

    // Proceed with the booking edit
    await fetch('http://localhost:4000/api/bookings/editbooking', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingDetails), // Use the bookingDetails state
    })
    .then((resp) => resp.json())
    .then((data) => {
      if (data.success) {
        alert("Booking Edited Successfully!");
        onEditSuccess(); // Call success callback
      } else {
        alert("Booking edit Failed");
      }
    })
    .catch((error) => {
      console.error("Error editing booking:", error);
      alert("An error occurred. Please try again.");
    });
  };
      
  return (
    <div className='p-8 box-border bg-white w-full rounded-sm mt-1 lg:ml-5'>
        <h2 className='bold-18 pb-2'>Delivery:</h2>
        <div className="flex flex-col gap-4 justify-start">
            <div className='flex flex-col gap-4'>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'><p>From</p>
                        <input value={bookingDetails.origin} onChange={changeHandler} type="text" name='origin' placeholder='From' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>To</p>
                        <input value={bookingDetails.destination} onChange={changeHandler} type="text" name='destination' placeholder='To' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>At</p>
                        <input value={bookingDetails.sendingDate} onChange={changeHandler} type="date" name='sendingDate' placeholder='Date' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
            </div>
        </div>

        {/* Pakage */}
        <h2 className='bold-18 pb-2 mt-5'>Pakage:</h2>
        <div className="flex flex-col gap-4 justify-start">
            <div className='flex flex-col gap-4'>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'><p>Length</p>
                        <input value={bookingDetails.length} onChange={changeHandler} type="number" name='length' placeholder='Length' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Width</p>
                        <input value={bookingDetails.width} onChange={changeHandler} type="number" name='width' placeholder='Width' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Height</p>
                        <input value={bookingDetails.height} onChange={changeHandler} type="number" name='height' placeholder='Height' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'><p>Category</p>
                        <select value={bookingDetails.category} onChange={changeHandler} name="category" id="" className='bg-primary ring-1 ring-transparent medium-16 rounded-sm outline-none mb-3 w-full py-3 px-4'>
                            <option value="documents">Documents</option>
                            <option value="electronics">Appliances</option>
                            <option value="furniture">Furniture</option>
                            <option value="clothing">Clothing</option>
                            <option value="antiques">Antiques & Heirlooms</option>
                            <option value="crates">Crates Pallets Cartons</option>
                            <option value="tools">Tools & Industrial</option>
                            <option value="sporting goods">Sporting Goods</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className='mb-3 w-1/3'><p>Weight</p>
                        <input value={bookingDetails.weight} onChange={changeHandler} type="number" name='weight' placeholder='Weight' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Value</p>
                        <input value={bookingDetails.value} onChange={changeHandler} type="number" name='value' placeholder='Value' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
            </div>
        </div>

        <div className='mb-3'>
            <h2 className='bold-18 pb-2 mt-5'>Sender:</h2>
            <input value={bookingDetails.senderName} onChange={changeHandler} type="text" name='senderName' placeholder='Name' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderCompany} onChange={changeHandler} type="text" name='senderCompany' placeholder='Company' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderEmail} onChange={changeHandler} type="email" name='senderEmail' placeholder='Email' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderPhone} onChange={changeHandler} type="tel" name='senderPhone' placeholder='Phone' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderReference} onChange={changeHandler} type="text" name='senderReference' placeholder='Reference' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-4' />
        </div>

        <div className='mb-3'>
            <h2 className='bold-18 pb-2 mt-5'>Receiver:</h2>
            <input value={bookingDetails.receiverName} onChange={changeHandler} type="text" name='receiverName' placeholder='Name' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.receiverCompany} onChange={changeHandler} type="text" name='receiverCompany' placeholder='Company' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.receiverEmail} onChange={changeHandler} type="email" name='receiverEmail' placeholder='Email' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.receiverPhone} onChange={changeHandler} type="tel" name='receiverPhone' placeholder='Phone' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-4' />
        </div>

        <div>
            
        </div>
        <div className='flex gap-x-3'>
            <button onClick={() => Edit_Booking()} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Save</button>
            <button onClick={onBack} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Back to List</button>
        </div>
    </div>
    // </div>
  )
}


export default EditBooking