import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Offer = () => {

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setTimeout(() => {
        setIsHovered(false);
        }, 2000); // 2000 milliseconds = 2 seconds
    };

    return (
      <section className="relative w-full px-4 py-24 mt-16" onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
        <h3 className='h2 text-right relative max_padd_container'>Special</h3>
        <div className={`absolute inset-0 bg-banneroffer bg-cover bg-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}></div>
        <div className="relative max_padd_container z-5">
          <h2 className="h2 capitalize text-white text-right">Free Assistance Fee!</h2>
          <div className="flex justify-end py-2">
            <button className="btn_dark_rounded"><Link to='booking'>Get a Quote Now</Link></button>
          </div>
        </div>
      </section>
    )
  }
  
  export default Offer
  