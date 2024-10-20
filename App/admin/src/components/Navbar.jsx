import logo from '../assets/logo.svg'
import profileImg from "../assets/profile.png"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaHome } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
  const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'https://www.nimpression.site' || 'http://3.27.181.196:80'|| 'http://localhost:5173';
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	
  let timeoutId;

  const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
      clearTimeout(timeoutId); // Clear any existing timeout
  };

  const handleLogout = () => {
      localStorage.removeItem('auth-token');
      window.location.replace("/");
      console.log("Logged out");
  };

  const handleMouseLeave = () => {
      timeoutId = setTimeout(() => {
          setDropdownOpen(false);
      }, 3000); // Set timeout for 3 seconds
  };

  const handleMouseEnter = () => {
      clearTimeout(timeoutId); // Clear timeout if mouse enters
  };


  
  return (
    <nav className=' bg-white py-2 ring-1 ring-slate-900/5 relative'>
      <div className='mx-auto max-w-[1440px] px-6 lg:px-20  flexBetween'>
      <Link to="/">
        <div><img src={logo} alt="" height={46} width={46}/></div>
      </Link>
      <Link to="/">
        <div className='hidden sm:flex uppercase bold-22 text-white bg-secondary px-3 rounded-md tracking-widest line-clamp-1 max-xs:bold-18 max-xs:py-2 max-xs:px-1'>
          Admin Panel
        </div>
      </Link>
      {/* profile image */}
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <img src={profileImg} alt="" onClick={toggleDropdown} className='h-12 w-12 rounded-full' />
          {dropdownOpen && (
            <div className='absolute top-20 right-0 p-2 bg-white rounded-2xl shadow-md flexBetween items-start flex-col gap-y-12 gap-x-1 w-40 ring-1 ring-slate-900/5 transition-all duration-300'>
            <ul>
              <li className='p-2 hover:bg-slate-900/10 flexBetween gap-x-1'>
                <Link to={VITE_FRONTEND_URL} className="flex justify-between gap-x-1"><FaHome />Home</Link>
              </li>
              
              {/* Divider line */}
              <div className="border-t border-slate-200 my-2"></div>
          
              {/* Conditionally render Logout or Login based on auth-token */}
              {localStorage.getItem('auth-token') ? 
                (
                  <li className='p-2 hover:bg-slate-900/10 flexBetween gap-x-1'>
                    <Link 
                      to="/logout" 
                      className="flex gap-x-1" 
                      onClick={handleLogout}>
                      <IoLogOut /> Logout
                    </Link>
                  </li>
                ) : (
                  <li className='p-2 hover:bg-slate-900/10 flexBetween gap-x-1'>
                    <Link to="/login" className="flex gap-x-1">
                      <BiUser /> Login
                    </Link>
                  </li>
                )
              }
            </ul>
          </div>
          
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
