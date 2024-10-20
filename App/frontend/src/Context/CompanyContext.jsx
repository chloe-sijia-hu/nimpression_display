
import { createContext, useEffect, useState, useContext } from "react";


export const CompanyContext = createContext(null);


const CompanyContextProvider = (props) => {
    
    // const [cartItems, setCartItems] = useState(getDefaultCart());
    const [all_trucks, setAll_trucks] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userBookings, setUserBookings] = useState([]);
	const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        console.log("Token retrieved from localStorage:", token); // Log the token

        if (token) {
            fetch(`${VITE_API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
            })
            .then((response) => {

                if (!response.ok) {
                    throw new Error(`Error fetching user data: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched User ID:', data._id); 
                console.log('Fetched User Data:', data);
                setUserId(data._id); // Set userId
            })
            .catch((error) => console.error('Error fetching user ID:', error));
        }
    }, []);
    

    useEffect(() => {
        fetch(`${VITE_API_URL}/trucks/alltrucks`, {
        //   credentials: 'include', 
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error fetching trucks: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => setAll_trucks(data))
          .catch((error) => console.error('Error fetching trucks:', error));
      }, []);
      
    
    


const fetchUserBookings = async (userId) => {
    try {
        const response = await fetch(`${VITE_API_URL}/bookings/user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
            },
            credentials: 'include',
        });

        if (response.status === 403) {
            console.error('Token is invalid or expired. Logging out...');
            localStorage.removeItem('auth-token'); // Clear token
            // Redirect to login or show a login modal
            window.location.href = '/login'; // Example redirect
            return;
        }
        

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching user bookings:', errorText);
            throw new Error(`Error fetching user bookings: ${errorText}`);
        }

        const data = await response.json();
        setUserBookings(data); // Update state with user bookings
    } catch (error) {
        console.error('Error fetching user bookings:', error);
    }
};

    
useEffect(() => {
    if (userId) {
        fetchUserBookings(userId); // Fetch bookings for the user
    }
}, [userId]);
      


    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }
    
    const contextValue = {
        getTotalCartItems,
        all_trucks,
        userId,
        // cartItems,
        userBookings,
        fetchUserBookings,
    };

    return (
        <CompanyContext.Provider value={contextValue}>
            {props.children}
        </CompanyContext.Provider>
    )
}

export default CompanyContextProvider;