import React from 'react'
import { useContext } from 'react'
import Item from "./Item";
import { NavLink } from 'react-router-dom'
import { CompanyContext } from '../Context/CompanyContext'

const Trucks = () => {

    const { all_trucks } = useContext(CompanyContext);

    // Filter the trucks to show only the available ones
    const availableTrucks = all_trucks.filter(truck => truck.available);

  return (
    <section className='bg-primary py-32'>
    <div className='max_padd_container py-12 xl:w-[88%]'>
        <div className='flex justify-between items-center mb-8'>
            <h3 className='h3 text-center mb-8'>Our Trucks</h3>
            <div className='max-xs:flex-col flex gap-2 py-10'>
                    {/* <NavLink to={''} className={"btn_dark_rounded flex-center"}>
                        Contact Us
                    </NavLink> */}
                    <NavLink to={'/booking'} className={"btn_secondary_rounded flex-center gap-x-2"}>
                        Get a Quote Now
                    </NavLink>
            </div>
        </div>
        {/* <hr className='h-[3px] md:w-1/2 mx-auto bg-gradient-to-l from-transparent via-black to-transparent mb-16'/> */}
        {/* CONTAINER */}
        <div className='grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6'> 
            {availableTrucks.map((item) => (
                <Item key={item.id} id={item.id} image={item.image} name={item.name} info={item.info} gcw={item.gcw}/>
            ))}
        </div>

    </div>
</section>
  )
}

export default Trucks




