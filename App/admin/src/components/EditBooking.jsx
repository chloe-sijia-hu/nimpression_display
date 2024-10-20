import React, { useState, useEffect } from 'react';

const EditBooking = ({ booking, onBack, onEditSuccess }) => {

  const [bookingDetails, setBookingDetails] = useState({
    ...booking,
    sendingDate: booking.sendingDate ? new Date(booking.sendingDate).toISOString().split('T')[0] : '', // Convert to YYYY-MM-DD
  });

	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
  const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.nimpression.site' || 'http://3.27.181.196:80'|| 'http://localhost:5173';
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	
  const [googleApiKey, setGoogleApiKey] = useState('');

  useEffect(() => {
    // Fetch Google API key from your backend or use a static key for testing
    fetch(`${VITE_API_URL}/places/config`)
      .then(response => response.json())
      .then(data => setGoogleApiKey(data.apiKey))
      .catch(error => console.error('Error fetching API key:', error));
  }, []);

  useEffect(() => {
    if (!googleApiKey) return;

    // Check if the Google Maps script is already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        if (window.google && window.google.maps) {
          initializeAutocomplete('origin');
          initializeAutocomplete('destination');
        }
      };
    } else {
      // Initialize autocomplete if the script is already loaded
      initializeAutocomplete('origin');
      initializeAutocomplete('destination');
    }
  }, [googleApiKey]);

  // Function to initialize autocomplete
  const initializeAutocomplete = (id) => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputElement, {
        types: ['address'],
        componentRestrictions: { country: ['NZ'] } // Limit to New Zealand
      });
  
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log(`Selected place for ${id}:`, place);
        setBookingDetails(prevState => ({
          ...prevState,
          [id]: place.formatted_address // Set origin or destination in bookingDetails
        }));
      });
    } else {
      console.error(`Input element with id ${id} not found.`);
    }
  };

  const allowedTransitions = {
    "Pending": ["Pending", "Wait for payment", "Paid", "Payment received. Order in process"],
    "Wait for payment": ["Wait for payment", "Paid", "Payment received. Order in process"],
    "Paid": ["Paid", "Wait for payment", "Payment received. Order in process"],
    "Payment received. Order in process": ["Payment received. Order in process", "Wait for payment", "Delivered"],
    "Delivered": ["Payment received. Order in process", "Delivered"],
  };
  
  const changeHandler = (e) => {
    const { name, value } = e.target;
  
    if (name === 'status') {
      const currentStatus = bookingDetails.status;
      if (allowedTransitions[currentStatus]?.includes(value)) {
        setBookingDetails(prevDetails => ({
          ...prevDetails,
          [name]: value
        }));
      } else {
        console.log(`Transition from ${currentStatus} to ${value} is not allowed.`);
      }
    } else if (name === 'sendingDate' || bookingDetails.status === 'Pending') {
      // Allow editing sendingDate at any time, or any field if status is 'Pending'
      setBookingDetails(prevDetails => ({
        ...prevDetails,
        [name]: value
      }));
    } else {
      console.log(`Editing ${name} is not allowed when status is not Pending.`);
    }
  };
  

  const calculateDeliveryFee = (weight, length, width, height, duration) => {
  };
  

  const calculateDuration = async (origin, destination) => {
    try {
      const response = await fetch(`${VITE_API_URL}/bookings/get-distance`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin, destination }),
      });
  
      if (!response.ok) {
        throw new Error('Error fetching duration data');
      }
  
      const data = await response.json();
      if (data.success) {
        return data.duration; // Assuming the response contains a `duration` field
      } else {
        throw new Error(data.message || 'Could not calculate duration');
      }
    } catch (error) {
      console.error('Error calculating duration:', error);
      return null; // Or handle it as needed
    }
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

  const Edit_Booking = async () => {
    console.log(bookingDetails);
  
    // Get duration data
    const durationValue = await calculateDuration(bookingDetails.origin, bookingDetails.destination);
    if (durationValue === null) {
      alert("Could not calculate duration.");
      return; // Exit early if duration fetch fails
    }
  
    // Calculate delivery fee and chargeable weight
    const { chargeableWeight, deliveryFee } = calculateDeliveryFee(
      bookingDetails.weight,
      bookingDetails.length,
      bookingDetails.width,
      bookingDetails.height,
      durationValue // Pass the new duration
    );
  
    const updatedBookingDetails = {
      ...bookingDetails,
      duration: durationValue,
      chargeableWeight: chargeableWeight,
      deliveryFee: deliveryFee,
    };
  
    // Proceed with the booking edit
    const editResponse = await fetch(`${VITE_API_URL}/bookings/editbooking`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBookingDetails), // Use the updatedBookingDetails
    });
  
    const editData = await editResponse.json();
    if (editData.success) {
      alert("Booking Edited Successfully!");
      onEditSuccess(); // Call success callback
    } else {
      alert("Booking edit Failed");
    }
  };
      
  return (
    <div className='p-8 box-border bg-white w-auto rounded-sm mt-1 lg:ml-5'>
        <p className='mb-4'>Note that the Chargeable Weight and Duration are not changable. They will change based on the weight/size and the new origin and destination.</p>
        <h2 className='bold-18 pb-2'>Delivery:</h2>
        <div className="flex flex-col gap-4 justify-start">
            <div className='flex flex-col gap-4'>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'><p>From</p>
                        <input value={bookingDetails.origin} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} id="origin" type="text" name='origin' placeholder='From' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>To</p>
                        <input value={bookingDetails.destination} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} id="destination" type="text" name='destination' placeholder='To' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    {/* Sending date can be changed at any status apart from delivered */}
                    <div className='mb-3 w-1/3'><p>At</p>
                        <input value={bookingDetails.sendingDate} onChange={changeHandler} type="date" name='sendingDate' placeholder='Date' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 justify-start">
            <div className='flex flex-col gap-4'>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'><p>Duration</p>
                    
                        <input value={formatDuration(booking.duration)} readOnly type="text" name='duration' placeholder='Duration' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Chargeable Weight (kg)</p>
                        <input value={bookingDetails.chargeableWeight} readOnly type="number" name='chargeableWeight' placeholder='Chargeable Weight' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Delivery Fee (GST Included) ($)</p>
                        <input value={bookingDetails.deliveryFee} onChange={changeHandler} readOnly type="number" name='deliveryFee' placeholder='Delivery Fee' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
            </div>
        </div>

        {/* Pakage */}
        <h2 className='bold-18 pb-2 mt-5'>Pakage:</h2>
        <div className="flex flex-col gap-4 justify-start">
            <div className='flex flex-col gap-4'>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'><p>Length (cm)</p>
                        <input value={bookingDetails.length} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="number" name='length' placeholder='Length' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Width (cm)</p>
                        <input value={bookingDetails.width} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="number" name='width' placeholder='Width' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Height (cm)</p>
                        <input value={bookingDetails.height} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="number" name='height' placeholder='Height' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className='mb-3 w-1/3'><p>Category</p>
                        <select value={bookingDetails.category} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} name="category" id="" className='bg-primary ring-1 ring-transparent medium-16 rounded-sm outline-none mb-3 w-full py-3 px-4'>
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
                    <div className='mb-3 w-1/3'><p>Weight (kg)</p>
                        <input value={bookingDetails.weight} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="number" name='weight' placeholder='Weight' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                    <div className='mb-3 w-1/3'><p>Value ($)</p>
                        <input value={bookingDetails.value} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="number" name='value' placeholder='Value' className='bg-primary outline-none max-w-80 w-full py-3 px-4 rounded-md' />
                    </div>
                </div>
            </div>
        </div>

        <div className='mb-3'>
            <h2 className='bold-18 pb-2 mt-5'>Sender:</h2>
            <input value={bookingDetails.senderName} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="text" name='senderName' placeholder='Name' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderCompany} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="text" name='senderCompany' placeholder='Company' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderEmail} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="email" name='senderEmail' placeholder='Email' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderPhone} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="tel" name='senderPhone' placeholder='Phone' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.senderReference} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="text" name='senderReference' placeholder='Reference' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-4' />
        </div>

        <div className='mb-3'>
            <h2 className='bold-18 pb-2 mt-5'>Receiver:</h2>
            <input value={bookingDetails.receiverName} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="text" name='receiverName' placeholder='Name' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.receiverCompany} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="text" name='receiverCompany' placeholder='Company' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.receiverEmail} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="email" name='receiverEmail' placeholder='Email' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-2' />
            <input value={bookingDetails.receiverPhone} onChange={changeHandler} readOnly={bookingDetails.status !== 'Pending'} type="tel" name='receiverPhone' placeholder='Phone' className='bg-primary outline-none max-w-200 w-full py-3 px-4 rounded-md mb-4' />
        </div>

        <div className='mb-3'>
            <h2 className='bold-18 pb-2 mt-5'>Booking Status:</h2>
              <select value={bookingDetails.status} onChange={changeHandler} name="status" id="status" className='bg-primary ring-1 ring-transparent medium-16 rounded-sm outline-none mb-3 w-full py-3 px-4'>
                {/* Dynamically generate the options based on the allowed transitions */}
                {allowedTransitions[bookingDetails.status]?.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
        </div>

        <div className='flex gap-x-3'>
            <button onClick={() => Edit_Booking()} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Save</button>
            <button onClick={onBack} className="btn_dark_rounded mt-4 flexCenter gap-x-1">Back to List</button>
        </div>
    </div>
     </div>
  )
}


export default EditBooking