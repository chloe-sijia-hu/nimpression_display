import React from 'react'
import {Link} from "react-router-dom"
import { FaTruckArrowRight } from "react-icons/fa6";
import { MdPlaylistAddCircle } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { PiNotebookFill } from "react-icons/pi";

const Sidebar = () => {
    return (
      <div className='py-7 flex justify-center gap-x-2 gap-y-5 w-full bg-white sm:gap-x-4 lg:flex-col lg:pt-20 lg:max-w-60 lg:h-screen lg:justify-start lg:pl-6'> 
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
      </div>
    )
  }



export default Sidebar