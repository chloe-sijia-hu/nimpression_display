import React, { useState } from 'react';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
	const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
    
    const handleSubscribe = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await fetch(`${VITE_API_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Send the email to the backend
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Notify the user of success
                setEmail(''); // Clear the input field
            } else {
                const errorData = await response.json();
                alert(errorData.error); // Notify the user of an error
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while subscribing');
        }
    };

    return (
        <section className="max_padd_container py-12 xl:py-28 bg-white">
            <div className="mx-auto xl:w-[80%] flexCenter flex-col gap-y-8 w-full max-w-[666px]">
                <h3 className="h3">Get Exclusive offers on Your Email</h3>
                <h4 className="uppercase bold-18">Subscribe to our newsletter and stay updated</h4>
                <form onSubmit={handleSubscribe} className="flexBetween rounded-full ring-1 ring-slate-900/10 hover:ring-slate-900/15 bg-primary w-full max-w-[588px]">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full bg-transparent ml-7 border-none outline-none regular-16"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update the state on input change
                        required
                    />
                    <button type="submit" className="btn_dark_rounded">Subscribe</button>
                </form>
            </div>
        </section>
    );
};

export default NewsLetter;
