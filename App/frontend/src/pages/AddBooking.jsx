import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { NavLink } from "react-router-dom"
import { FaTruckMoving, FaCalendar } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";
import { CompanyContext } from '../Context/CompanyContext';
// import jwt_decode from 'jwt-decode';

const AddBooking = ({ userId }) => {
  const navigate = useNavigate();

      // State to hold form input values
  const [bookingDetails, setBookingDetails] = useState({
        origin: "",
        destination: "",
        category: "",
        // dimensions: 
        length: "",
        width: "",
        height: "",
        weight: "",
        value: "",
        // sender:
        sendingDate: "",
        senderName: "",
        senderCompany: "",
        senderEmail: "",
        senderPhone: "",
        senderReference: "",
        // receiver:
        receiverName: "",
        receiverCompany: "",
        receiverEmail: "",
        receiverPhone: "",
        userId: userId,
        duration: "",
        chargeableWeight: "",
        deliveryFee: "",
        status: "Pending",
    });

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState('');

	const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
  
  const redirectToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    // Fetch Google API key from your backend or use a static key for testing
    fetch(`${VITE_API_URL}/places/config`)
      .then(response => response.json())
      .then(data => setGoogleApiKey(data.apiKey))
      .catch(error => console.error('Error fetching API key:', error));
  }, []);


  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setIsLoggedIn(false);
      setShowModal(true);
      return; // Exit early if not logged in
    } else {
      setIsLoggedIn(true);
      setShowModal(false);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      console.log("Decoded Token from addbooking:", decodedToken);

      const userRole = decodedToken.role; 
      const userId = decodedToken.id;      
      console.log("Decoded role: ", userRole);
      console.log("Decoded ID: ", userId);

      // Check for specific role 
      if (userRole !== 'admin' && userRole !== 'customer') {  
        setShowAccessDenied(true); // Show Access Denied message if role is unauthorized
        setIsLoggedIn(false); // Optionally log out the user if unauthorized
        return; // Exit early if access is denied
      } else {
        setShowAccessDenied(false); // Allow access if the role is authorized
        setBookingDetails(prevState => ({
          ...prevState,
          userId: userId
      }));
    }
  }
}, []);

  useEffect(() => {
    if (!googleApiKey) return;

    if (!window.google || !window.google.maps) {
      if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        document.head.appendChild(script);

        script.onload = () => {
          if (window.google && window.google.maps) {
            initializeAutocomplete('origin');
            initializeAutocomplete('destination');
          } else {
            console.error('Google Maps API is not available.');
          }
        };

        script.onerror = (error) => {
          console.error('Error loading Google Maps script:', error);
        };

        return () => {
          document.head.removeChild(script);
        };
      }
    }
  }, [googleApiKey]);

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
    
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setBookingDetails(prevState => ({
      ...prevState,
      [id]: value
    }));
  };



  const calculateDeliveryFee = (weight, length, width, height, duration) => {
    // Calculate volumetric weight
    const volumetricWeight = (length * width * height) / 1000000;
    console.log("Volumetric Weight:", volumetricWeight);

    // Determine chargeable weight
    const chargeableWeight = Math.max(weight, volumetricWeight);
    console.log("Chargeable Weight:", chargeableWeight);

    console.log("Duration in calculateDeliveryFee_addbooking.jsx:", duration);


    // Convert duration from seconds to hours and add $30 for each hour
    const durationInHalfHours = Math.ceil(duration / 1800); // Round up to next half of an hour
    console.log("Duration in Half Hours:", durationInHalfHours);
  
    // Calculate delivery fee based on chargeable weight
    let deliveryFee;
  
    if (chargeableWeight > 10) {
      deliveryFee = chargeableWeight * 4 + durationInHalfHours * 15; // $4 per kg for over 10kg, $15 per hour
    } else if (chargeableWeight === 1) {
      deliveryFee = 10 + durationInHalfHours * 15; // $10 for 1 kg
    } else if (chargeableWeight > 1 && chargeableWeight <= 10) {
      deliveryFee = 8 + durationInHalfHours * 15; // $8 for 1 to 10 kg
    } else {
      deliveryFee = 0; // No fee for 0 kg or negative weight (if applicable)
    }


    console.log("Final Delivery Fee:", deliveryFee); // Log the final delivery fee
  
    return {
      chargeableWeight: chargeableWeight,
      deliveryFee: deliveryFee
    };
  };

    
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');
      const distanceResponse = await fetch(`${VITE_API_URL}/bookings/get-distance`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: bookingDetails.origin,
          destination: bookingDetails.destination,
        }),
      });

      if (!distanceResponse.ok) {
        const errorData = await distanceResponse.json();
        throw new Error(`Distance request failed! ${errorData.message}`);
      }

      const distanceData = await distanceResponse.json();
      if (distanceData.success) {
        const durationValue = distanceData.duration;
        const { chargeableWeight, deliveryFee } = calculateDeliveryFee(
          bookingDetails.weight,
          bookingDetails.length,
          bookingDetails.width,
          bookingDetails.height,
          durationValue
        );

        const updatedBookingDetails = {
          ...bookingDetails,
          duration: durationValue,
          chargeableWeight: chargeableWeight,
          deliveryFee: deliveryFee,
        };

        const bookingResponse = await fetch(`${VITE_API_URL}/bookings/addbooking`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedBookingDetails),
        });

        if (!bookingResponse.ok) {
          const errorData = await bookingResponse.json();
          throw new Error(`Booking request failed! ${errorData.message}`);
        }

        const bookingData = await bookingResponse.json();
        if (bookingData.success) {
          alert("Booking Added Successfully! \nYou can edit/delete it in the cart when it's in pending status. \nPlease make payment when it has been checked by our staff.");
          navigate('/cart');
        } else {
          alert("Upload Failed: " + bookingData.message);
        }
      } else {
        throw new Error(distanceData.message);
      }
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("An error occurred: " + error.message);
    }
  };
    

    

  return (
    <form onSubmit={handleSubmit}>
      {showModal && (
        <section className="max_padd_container flexCenter flex-col pt-32 pb-5">
          <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto px-14 py-10 rounded-md">
            <h3 className="h3">Book Online</h3>
            <p className="pb-3">To make a booking, please login</p>
            <button className="btn_secondary_rounded my-6 w-full !rounded-md" onClick={redirectToLogin}>Login</button>
          </div>
        </section>
      )}

      {showAccessDenied && (
        <section className="max_padd_container flexCenter flex-col pt-32 pb-5">
          <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto px-14 py-10 rounded-md">
            <h3 className="h3">Book Online</h3>
            <p className="pb-3">Access Denied. You do not have permission to add bookings.</p>
          </div>
        </section>
      )}

      {!showModal && !showAccessDenied && (

      <section className="max_padd_container flexCenter flex-col pt-32 pb-5">
      <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="h3">Book Online</h3>
        <p className="pb-3">Use our online booking tool to estimate freight charges and book your shipment today.</p>

        {/* <form onSubmit={handleSubmit}> */}
          {/* Where are you sending section */}
          <h4 className="h4 mt-3 flex items-center gap-x-2 justify-start bold-18"><FaTruckMoving />Where are you sending?</h4>
          <div className="flex flex-col gap-4 mt-3 mb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="w-1/2">
                  <h4 className="h4">From</h4>
                   <input
                      id="origin"
                      value={bookingDetails.origin}
                      onChange={handleChange} 
                      placeholder="Please enter a town, city, postcode or address"
                      className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                  />
                </div>
                <div className="w-1/2">
                  <h4 className="h4">To</h4>
                    <input
                      id="destination"
                      value={bookingDetails.destination}
                      onChange={handleChange} 
                      placeholder="Please enter a town, city, postcode or address"
                      className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                    />
                </div>
              </div>
            </div>
          </div>

          {/* What are you sending section */}
          <h4 className="h4 pt-4 flex items-center gap-x-2 justify-start bold-18"><FaBoxOpen />What are you sending?</h4>
          <div className="flex flex-col gap-4 mt-3">
            <div className="flex flex-col gap-4">
              {/* Category Dropdown */}
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <h4 className="h4">Category</h4>
                  <select 
                    id="category"
                    value={bookingDetails.category}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                  >
                    <option value="">Please select a category</option>
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
              </div>

              {/* Dimensions Input */} 
              <div>
                <h4 className="h4">Dimensions (L x W x H cm)</h4>
                <div className="flex flex-row gap-4">
                  <div className="w-1/3">
                    <input
                      type="number"
                      id="length"
                      placeholder="Length"
                      value={bookingDetails.length}
                      onChange={handleChange}
                      className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                    />
                  </div>
                  <div className="w-1/3">
                    <input
                      type="number"
                      id="width"
                      placeholder="Width"
                      value={bookingDetails.width}
                      onChange={handleChange}
                      className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                    />
                  </div>
                  <div className="w-1/3">
                    <input
                      type="number"
                      id="height"
                      placeholder="Height"
                      value={bookingDetails.height}
                      onChange={handleChange}
                      className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Weight Input */}
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <h4 className="h4">Weight (kg)</h4>
                  <input
                    type="number"
                    id="weight"
                    placeholder="Please enter weight"
                    value={bookingDetails.weight}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                  />
                </div>
              </div>

              {/* Value Input */}
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <h4 className="h4">Value ($)</h4>
                  <input
                    type="number"
                    id="value"
                    placeholder="Please enter value"
                    value={bookingDetails.value}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

           {/* When are you sending section */}
           <h4 className="h4 pt-8 flex items-center gap-x-2 justify-start bold-18"><FaCalendar />When are you sending?</h4>
          <div className="flex flex-col gap-4 mt-3 mb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <h4 className="h4">Date</h4>
                  <p>Please select a date after tomorrow to allow us sufficient time to process your order efficiently.</p>
                  <input
                    type="date"
                    id="sendingDate"
                    value={bookingDetails.sendingDate}
                    onChange={handleChange}
                    placeholder="Please enter the date"
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
                    min={new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]}  // sets the minimum date to tomorrow
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Who are you sending section */}
          <h4 className="h4 pt-4 flex items-center gap-x-2 justify-start bold-18"><FaCalendar />Who are you sending from and to?</h4>
          <div className="flex flex-col gap-4 mt-3 mb-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <h4 className="h4">Sender's Details</h4>
                  <input
                    type="text"
                    id="senderName"
                    placeholder="Full name"
                    value={bookingDetails.senderName}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                   <input
                    type="text"
                    id="senderCompany"
                    placeholder="Company (Optional)"
                    value={bookingDetails.senderCompany}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                   <input
                    type="email"
                    id="senderEmail"
                    placeholder="Email"
                    value={bookingDetails.senderEmail}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                  <input
                    type="tel"
                    id="senderPhone"
                    placeholder="Phone number"
                    value={bookingDetails.senderPhone}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                  <input
                    type="text"
                    id="senderReference"
                    placeholder="Reference (Optional)"
                    value={bookingDetails.senderReference}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                </div>
              </div>
            </div>
            {/* Receiver */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <h4 className="h4">Receiver's Details</h4>
                  <input
                    type="text"
                    id="receiverName"
                    placeholder="Full name"
                    value={bookingDetails.receiverName}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                   <input
                    type="text"
                    id="receiverCompany"
                    placeholder="Company(Optional)"
                    value={bookingDetails.receiverCompany}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                   <input
                    type="email"
                    id="receiverEmail"
                    placeholder="Email"
                    value={bookingDetails.receiverEmail}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                  <input
                    type="tel"
                    id="receiverPhone"
                    placeholder="Phone number"
                    value={bookingDetails.receiverPhone}
                    onChange={handleChange}
                    className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl mb-3"
                  />
                </div>
              </div>
            </div>

          </div>

          <button type="submit" className="btn_secondary_rounded my-6 w-full !rounded-md">Get Your Quote</button>

        {/* </form> */}

        <p className="text-black font-bold">More Questions? 
          <span className="text-secondary underline cursor-pointer"><NavLink to={`/contact`}> Contact Us</NavLink></span>
        </p>

        <div className="flexCenter mt-6 gap-3">
            <p>Please note that the price provided may not be final and could change based on the time required to load or unload the product.</p>
        </div>
        
      </div>
    </section>

    )}

  </form>
   
  )
}

export default AddBooking