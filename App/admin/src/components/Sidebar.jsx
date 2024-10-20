import React, { useState } from 'react'
import { Link, NavLink } from "react-router-dom"
import { FaTruckArrowRight } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { MdPlaylistAddCircle } from "react-icons/md";
import { PiNotebookFill } from "react-icons/pi";
import { TbHomeStats } from "react-icons/tb";
import { MdEmail, MdMenu, MdClose } from "react-icons/md";

const Sidebar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    let timeoutId;

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        clearTimeout(timeoutId); // Clear any existing timeout
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
      <div className='py-7 flex justify-center gap-x-2 gap-y-5 w-full bg-white sm:gap-x-4 lg:flex-col lg:pt-20 lg:max-w-60 lg:h-screen lg:justify-start lg:pl-6 z-50'> 
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button onClick={toggleDropdown} className="flex items-center lg:hidden">
            {/* <span className="text-lg">Menu</span> */}
            <MdMenu className="lg:hidden cursor-pointer hover:text-secondary mr-2 p-1 ring-1 ring-slate-900/30 h-8 w-8 rounded-full"/>
          </button>
          {dropdownOpen && ( // Show dropdown only on xs
            // <div className='absolute top-40 right-0 p-2 bg-white rounded-2xl shadow-md flex flex-col gap-y-2 w-40 ring-1 ring-slate-900/5 transition-all duration-300'>
            <div className='absolute top-40 left-1/2 transform -translate-x-1/2 p-2 bg-white rounded-2xl shadow-md flex flex-col gap-y-2 w-40 ring-1 ring-slate-900/5 transition-all duration-300 z-50'>
              <NavLink to={'/dashboard'} className={({ isActive }) =>
                  isActive
                    ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-full"
                    : "flexCenter gap-2 rounded-md bg-primary h-12 w-full"
                }
              >
                <TbHomeStats /><span>Dashboard</span>
              </NavLink>

              <NavLink to={'/addtruck'} className={({ isActive }) =>
                  isActive
                    ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-full"
                    : "flexCenter gap-2 rounded-md bg-primary h-12 w-full"
                }
              >
                <MdPlaylistAddCircle /><span>Add Truck</span>
              </NavLink>

              <NavLink to={'/listtruck'} className={({ isActive }) =>
                  isActive
                    ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-full"
                    : "flexCenter gap-2 rounded-md bg-primary h-12 w-full"
                }
              >
                <FaTruckArrowRight /><span>Truck List</span>
              </NavLink>

              <NavLink to={'/listbooking'} className={({ isActive }) =>
                  isActive
                    ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-full"
                    : "flexCenter gap-2 rounded-md bg-primary h-12 w-full"
                }
              >
                <PiNotebookFill /><span>Booking List</span>
              </NavLink>

              <NavLink to={'/allusers'} className={({ isActive }) =>
                  isActive
                    ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-full"
                    : "flexCenter gap-2 rounded-md bg-primary h-12 w-full"
                }
              >
                <FaUser /><span>Customers</span>
              </NavLink>

              <NavLink to={'/subscription'} className={({ isActive }) =>
                  isActive
                    ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-full"
                    : "flexCenter gap-2 rounded-md bg-primary h-12 w-full"
                }
              >
                <MdEmail /><span>Subscription</span>
              </NavLink>
            </div>
          )}

          {/* Sidebar items for md screens */}
          <div className="hidden lg:flex lg:flex-col gap-y-2">
          {/* <div className="hidden"> */}
            <NavLink to={'/dashboard'} className={({ isActive }) =>
                isActive
                  ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-36 xs:w-44 medium-14 xs:medium-16"
                  : "flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16"
              }
            >
              <div className="flexCenter gap-x-1">
                <TbHomeStats /><span>Dashboard</span>
              </div>
            </NavLink>

            <NavLink to={'/addtruck'} className={({ isActive }) =>
                isActive
                  ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-36 xs:w-44 medium-14 xs:medium-16"
                  : "flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16"
              }
            >
              <div className="flexCenter gap-x-1">
                <MdPlaylistAddCircle /><span>Add Truck</span>
              </div>
            </NavLink>

            <NavLink to={'/listtruck'} className={({ isActive }) =>
                isActive
                  ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-36 xs:w-44 medium-14 xs:medium-16"
                  : "flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16"
              }
            >
              <div className="flexCenter gap-x-1">
                <FaTruckArrowRight /><span>Truck List</span>
              </div>
            </NavLink>

            <NavLink to={'/listbooking'} className={({ isActive }) =>
                isActive
                  ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-36 xs:w-44 medium-14 xs:medium-16"
                  : "flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16"
              }
            >
              <div className="flexCenter gap-x-1">
                <PiNotebookFill /><span>Booking List</span>
              </div>
            </NavLink>

            <NavLink to={'/allusers'} className={({ isActive }) =>
                isActive
                  ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-36 xs:w-44 medium-14 xs:medium-16"
                  : "flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16"
              }
            >
              <div className="flexCenter gap-x-1">
                <FaUser /><span>Customers</span>
              </div>
            </NavLink>

            <NavLink to={'/subscription'} className={({ isActive }) =>
                isActive
                  ? "flexCenter gap-2 rounded-md bg-slate-300 h-12 w-36 xs:w-44 medium-14 xs:medium-16"
                  : "flexCenter gap-2 rounded-md bg-primary h-12 w-36 xs:w-44 medium-14 xs:medium-16"
              }
            >
              <div className="flexCenter gap-x-1">
                <MdEmail /><span>Subscription</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
    )
  }



export default Sidebar
