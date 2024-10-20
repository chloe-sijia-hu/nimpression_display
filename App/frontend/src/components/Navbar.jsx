import {NavLink} from 'react-router-dom';
import { MdHomeFilled } from 'react-icons/md';
import { FaTruckFast, FaSquarePhone, FaCircleQuestion, FaCalendarCheck } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";

const Navbar = ({containerStyles}) => {


  return (
    <nav className={`${containerStyles}`}>
        <NavLink to={'/'} className={({isActive}) => isActive ? "active_link" : ""}>
            <div className="flexCenter gap-x-1"><FaHome/>Home</div>
        </NavLink>
        <NavLink to={'/booking'} className={({isActive}) => isActive ? "active_link" : ""}>
            <div className="flexCenter gap-x-1"><FaCalendarCheck/>Booking</div>
        </NavLink>
        <NavLink to={'/contact'} className={({isActive}) => isActive ? "active_link" : ""}>
            <div className="flexCenter gap-x-1"><FaSquarePhone/>Contact</div>
        </NavLink>
        <NavLink to={'/about'} className={({isActive}) => isActive ? "active_link" : ""}>
            <div className="flexCenter gap-x-1"><FaCircleQuestion/>About</div>
        </NavLink>
        <NavLink to={'/vehicles'} className={({isActive}) => isActive ? "active_link" : ""}>
            <div className="flexCenter gap-x-1"><FaTruckFast/>Vehicles</div>
        </NavLink>

    </nav>
  )
}

export default Navbar