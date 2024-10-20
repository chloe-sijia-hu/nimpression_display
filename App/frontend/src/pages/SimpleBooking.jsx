import React, { useState, useEffect } from 'react';

const SimpleBooking = () => {
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    // Fetch Google API key from your backend or use a static key for testing
    fetch('http://localhost:4000/api/places/config')
      .then(response => response.json())
      .then(data => setGoogleApiKey(data.apiKey))
      .catch(error => console.error('Error fetching API key:', error));
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
      const autocomplete = new window.google.maps.places.Autocomplete(inputElement, { types: ['address'] });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log(`Selected place for ${id}:`, place);
        if (id === 'origin') {
          setOrigin(place.formatted_address);
        } else if (id === 'destination') {
          setDestination(place.formatted_address);
        }
      });
    } else {
      console.error(`Input element with id ${id} not found.`);
    }
  };

  return (
    <div className='py-48 mt-24'>
      <h2>Simple Booking Form</h2>
      <div>
        <h4>From</h4>
        <input id="origin" type="text" placeholder="Enter origin" />
        <p>Selected origin: {origin}</p>
      </div>
      <div>
        <h4>To</h4>
        <input id="destination" type="text" placeholder="Enter destination" />
        <p>Selected destination: {destination}</p>
      </div>
    </div>
  );
};

export default SimpleBooking;
