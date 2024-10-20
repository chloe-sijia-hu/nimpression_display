import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';
import Navbar from './Navbar';
import { useContext, useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import { FaCartFlatbedSuitcase } from "react-icons/fa6";
import { BiUser, BiLogOut } from "react-icons/bi";
import { CompanyContext } from '../Context/CompanyContext';
import { MdSpaceDashboard } from "react-icons/md";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false)
  const toggleMenu = () => {
    setMenuOpened(!menuOpened);
    
    // If the menu is opened, set a timeout to close it after 3 seconds
    if (!menuOpened) {
      setTimeout(() => {
        setMenuOpened(false);
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  };
  const {getTotalCartItems} = useContext(CompanyContext);
	const VITE_API_URL = import.meta.env.VITE_API_URL || 'https://www.nimpression.site/api' || 'http://localhost:4000/api' || 'http://backend:4000/api';
	const VITE_ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'https://www.nimpression.site/admin' || 'http://3.27.181.196:80/admin' || 'http://admin:5174/admin'  || 'http://localhost:5174/admin';
  
  // Function to get user role from local storage
  const getUserRole = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) return null; // No token, no role

    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT
    return decodedToken.role; // Return the user's role
  };
  
    const userRole = getUserRole(); // Get the user role

  return (
    <header className="fixed top-0 right-0 left-0 mx-auto w-full bg-white ring-1 ring-slate-900/5 z-10">
        <div className="max_padd_container px-4 flexBetween py-3 max-xs:px-2">
            {/* logo" */}
            <div className='flexCenter gap-x-5 medium-15'>
                <Link to="/"><img src={logo} alt="logo" height={46} width={46}/></Link>
                <div className='bold-16'>Nimpression</div>
            </div>
            {/* navbar desktop */}
            <Navbar containerStyles={"hidden md:flex gap-x-5 xl:gap-x-10 medium-15"}/>
            {/* navbar mobile */}
            <Navbar containerStyles={`${menuOpened ? "flex items-start flex-col gap-y-12 fixed top-20 right-8 p-12 bg-white rounded-3xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300" : 
            "flex item-start flex-col gap-y-12 fixed top-20 p-12 bg-white rounded-3xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300 -right-[100%]"}`}/>
            {/* buttons */}
            <div className="flexBetween sm:gap-x-2 bold-16">
                {!menuOpened? (
                <MdMenu className="md:hidden cursor-pointer hover:text-secondary mr-2 p-1 ring-1 ring-slate-900/30 h-8 w-8 rounded-full " onClick={toggleMenu}/>
                ) : (
                <MdClose className="md:hidden cursor-pointer hover:text-secondary mr-2 p-1 ring-1 ring-slate-900/30 h-8 w-8 rounded-full " onClick={toggleMenu} />)}
                <div className="flexBetween sm:gap-x-6">
                  {/* only customer will be able to see their cart. only admin see admin dashboard */}
                      <>
                        {userRole !== 'admin' ? (
                          // <NavLink to={"cart"} className="flex">
                          //   <FaCartFlatbedSuitcase className="p-1 h-8 w-8 ring-1 ring-slate-900/30 rounded-full" />
                          // </NavLink>

                          <NavLink to={"cart"} className="flex">
                          <div className="flexCenter gap-x-2 btn_light_rounded medium-16">
                            My Quotes<FaCartFlatbedSuitcase className="h-5 w-5 z-40 rounded-full" />
                          </div>
                          </NavLink>
                        ) : (
                          <button onClick={() => { window.location.href = `${VITE_ADMIN_URL}/dashboard`; }} className="flex">
                          {/* <NavLink to={`${VITE_ADMIN_URL}/dashboard`} className="flex"> */}
                            <div className="flexCenter gap-x-2 btn_light_rounded medium-16">
                              Dashboard<MdSpaceDashboard className="h-5 w-5 z-40 rounded-full" />
                            </div>
                          {/* </NavLink> */}
                          </button>
                        )}
                      </>

                  {localStorage.getItem('auth-token') ? 
                    <NavLink onClick={()=>{localStorage.removeItem('auth-token'); window.location.replace("/")}} to={'logout'} className={"btn_secondary_rounded flexCenter gap-x-2 medium-16"}>
                    <BiLogOut className="h-5 w-5 z-40 text-white"/>
                    Logout
                    </NavLink> 
                    :
                    <NavLink to={'login'} className={"btn_secondary_rounded flexCenter gap-x-2 medium-16"}><BiUser className="h-5 w-5 z-40 text-white"/>
                    Login
                    </NavLink>}
                </div>
            </div>
        </div>

    </header>
  )
}

export default Header
