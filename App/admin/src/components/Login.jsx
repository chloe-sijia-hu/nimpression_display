import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Login = () => {


    const [state, setState] = useState("Login");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      username:"",
      password:"",
      email:""
    })

    const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
    const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.nimpression.site' || 'http://3.27.181.196:80'|| 'http://localhost:5173';
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
    
    const changeHandler = (e) => {
      setFormData({...formData,[e.target.name]:e.target.value});
    }
  
    const login = async () => {
      console.log("Login function executed", formData);
      let responseData;
    
      await fetch(`${VITE_API_URL}/users/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          Accept: 'application/json', 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
        .then((response) => response.json())
        .then((data) => responseData = data);
    
      if (responseData.success) {
        localStorage.setItem('auth-token', responseData.token);
        console.log("Stored token in localStorage: ", responseData.token);
    
        // Decode the token to check the user's role
        const decodedToken = JSON.parse(atob(responseData.token.split('.')[1]));
        const userRole = decodedToken.role; // Extract the role from the token
    
        // Redirect based on user role
        if (userRole === 'admin') {
          // Redirect to admin dashboard
          // window.location.href = `${VITE_ADMIN_URL}/dashboard`;
          navigate('/dashboard');
        } else {
          // Redirect to user dashboard
          window.location.href = `${VITE_FRONTEND_URL}`;
        }
      } else {
        alert(responseData.errors);
      }
    }
    
    
    const signup = async () => {
      console.log("signup function executed", formData);
      let responseData;
      await fetch(`${VITE_API_URL}/users/signup`, {
        method:"POST",
        credentials: 'include',
        headers: {
          Accept: 'application/formData',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      }).then((response)=> response.json()).then((data)=> responseData=data)
  
      if(responseData.success){
        localStorage.setItem('auth-token', responseData.token);
        window.location.replace('/admin/dashboard');
      }
      else{
        alert(responseData.errors)
      }
  
    }

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        if (token) {
            // User is already logged in, redirect or show logout button
            window.location.href = `${VITE_ADMIN_URL}/dashboard`; // Redirect to admin dashboard
        }
    }, []); // Run once on component mount

    const logout = () => {
        localStorage.removeItem('auth-token'); // Remove token from localStorage
        window.location.reload(); // Reload the page to show login form again
    }

    return (
        <section className="relative max_padd_container flexCenter flex-col">
            <div className="w-full left-1/2 h-auto bg-white m-auto px-14 py-10 rounded-md mt-10">
                <h3 className="h3">{state}</h3>
                <div className="flex flex-col gap-4 mt-7">
                    {localStorage.getItem('auth-token') ? ( // Check if user is logged in
                        <button onClick={logout} className="btn_secondary_rounded my-5 w-full !rounded-md">Logout</button> // Show logout button
                    ) : (
                        <>
                            {state === "Sign Up" ? <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl" /> : ''}
                            <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl" />
                            <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl" />
                            <button onClick={() => { state === "Login" ? login() : signup() }} className="btn_secondary_rounded my-5 w-full !rounded-md">Continue</button>
                            {state === "Sign Up" ? 
                                <p className="text-black font-bold">Already have an account? <span onClick={() => { setState("Login") }} className="text-secondary underline cursor-pointer">Login</span></p> 
                                : 
                                <p className="text-black font-bold">Create an account? <span onClick={() => { setState("Sign Up") }} className="text-secondary underline cursor-pointer">Click here</span></p>
                            }
                        </>
                    )}
                    {state === "Sign Up" ? 
                    <div className="flexCenter mt-6 gap-3">
                      <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                    :
                    <div className="flexCenter mt-6 gap-3">
                      <p>Please login to check your quote, communicate with us, and more!</p>
                    </div>
            }
                </div>
            </div>
        </section>
    )
}

export default Login
