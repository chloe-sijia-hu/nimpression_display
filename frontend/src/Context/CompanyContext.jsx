import { createContext, useEffect, useState, useContext } from "react";

export const CompanyContext = createContext(null);

const getDefaultCart = ()=> {
    let cart = {};
    for (let index = 0; index < 100 + 1; index++) {
        cart[index] = 0;
        
    }
    return cart;
}

const CompanyContextProvider = (props) => {
    
    const [cartItems, setCartItems] = useState(getDefaultCart());
    const [all_trucks, setAll_trucks] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userBookings, setUserBookings] = useState([]); 
   
    useEffect(()=> {
        fetch("http://localhost:4000/api/trucks/alltrucks").then((response)=> response.json()).then((data)=> setAll_trucks(data));
        if(localStorage.getItem('auth-token')){
            fetch('http://localhost:4000/getcart', {
                method: 'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json',
                },
                body:"",
            }).then((response)=> response.json()).then((data)=> setCartItems(data));
        }
    },[])

    useEffect(() => {
        if (userId) {
            fetchUserBooking(userId); // Fetch user bookings when userId changes
        }
    }, [userId]);


    const fetchUserBooking = async (userId) => {
        try {
            const response = await fetch(`http://localhost:4000/api/bookings/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                },
            });
    
            if (!response.ok) {
                // If the response is not OK (e.g., 404, 500), log the response for debugging
                const errorText = await response.text();
                console.error('Error response:', errorText); // Check if it's HTML or another error message
                throw new Error(`Error fetching user bookings: ${errorText}`);
            }
    
            const data = await response.json();
            setUserBookings(data); // Update state with user bookings
        } catch (error) {
            console.error('Error fetching user bookings:', error);
        }
    };
    
      


    const addToCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch("http://localhost:4000/addtocart", {
                method: 'POST',
                headers:{
                    Accept: 'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId": itemId}),
            }).then((response)=>response.json()).then((data)=>console.log(data));
        }
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({...prev, [itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch("http://localhost:4000/removefromcart", {
                method: 'POST',
                headers:{
                    Accept: 'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({"itemId": itemId}),
            }).then((response)=>response.json()).then((data)=>console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems){
             if(cartItems[item] > 0) {
                let itemInfo = all_trucks.find((truck)=> truck.id === Number(item));
                // totalAmount += itemInfo.new_price * cartItems[item];
             }
            }
            return totalAmount;
    }

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
        getTotalCartAmount,
        all_trucks,
        cartItems,
        addToCart,
        removeFromCart,
        fetchUserBooking,
        userBookings,
    };

    return (
        <CompanyContext.Provider value={contextValue}>
            {props.children}
        </CompanyContext.Provider>
    )
}

export default CompanyContextProvider;