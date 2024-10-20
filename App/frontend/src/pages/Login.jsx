import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [state, setState] = useState("Login");
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		email: ""
	});
	const [alerts, setAlerts] = useState([]);
	const navigate = useNavigate();
	const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';

	const changeHandler = (e) => {
		setFormData({...formData, [e.target.name]: e.target.value});
	}

	const login = async () => {
		console.log("Login function executed", formData);
		let responseData;

		try {
			const response = await fetch(`${VITE_API_URL}/users/login`, {
				method: "POST",
				credentials: 'include',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			console.log("Login API response status: ", response.status);
			console.log("Login API response headers: ", response.headers);

			if (!response.ok) {
				const errorData = await response.json();
				console.error(`Error: ${response.status} - ${response.statusText}`, errorData);
				alert(`Login failed: ${errorData.message || response.statusText}`);
				return;
			}

			responseData = await response.json();
			console.log("Parsed response data: ", responseData);

			if (responseData.success) {
				localStorage.setItem('auth-token', responseData.token);
				console.log("token from login: ", responseData.token);
				
				// Handle alerts
				const newAlerts = [];
				if (responseData.alerts) {
					responseData.alerts.waitingForPayment?.forEach(booking => {
						newAlerts.push(`Your booking ${booking.id} of ${booking.category} is waiting for payment.`);
					});
					responseData.alerts.delivered?.forEach(booking => {
						newAlerts.push(`Your booking ${booking.id} of ${booking.category} has been delivered.`);
					});
				}
				setAlerts(newAlerts);

				// Determine user role
				const decodedToken = JSON.parse(atob(responseData.token.split('.')[1]));
          		const userRole = decodedToken.role;

				// If there are alerts, show them first
				if (newAlerts.length > 0) {
					// You might want to implement a custom alert component or use a library like react-toastify
					alert(newAlerts.join('\n'));
				}

				// Redirect based on role
				if (userRole === 'admin') {
					window.location.href = `${VITE_ADMIN_URL}/dashboard`;
				} else {
					navigate('/');
				}
			} else {
				alert(responseData.errors);
			}
		} catch (error) {
			console.error("Error during login:", error);
			alert("An error occurred during login. Please try again.");
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
      window.location.replace('/');
    }
    else{
      alert(responseData.errors)
    }

  }


	useEffect(() => {
		if (alerts.length > 0) {
			alert(alerts.join('\n'));
			navigate('/');
		}
	}, [alerts, navigate]);

	return (
		<section className="max_padd_container flexCenter flex-col pt-32">
			<div className="max-w-[555px] h-auto bg-white m-auto px-14 py-10 rounded-md">
				<h3 className="h3">{state}</h3>
				<div className="flex flex-col gap-4 mt-7">
					{state === "Sign Up" ? <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl" /> : ''}
					<input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl" />
					<input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder="Password" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl" />
					<button onClick={()=>{state==="Login"?login():signup()}} className="btn_secondary_rounded my-5 w-full !rounded-md">Continue</button>
					{state === "Sign Up" ? 
					<p className="text-black font-bold">Already have an account? <span onClick={() => { setState("Login") }} className="text-secondary underline cursor-pointer">Login</span></p> 
					: 
					<p className="text-black font-bold">Create an account? <span onClick={() => { setState("Sign Up") }} className="text-secondary underline cursor-pointer">Click here</span></p>}


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
	);
}

export default Login;