import React from 'react'
import Item from "./Item";
import { useContext } from 'react';
import { CompanyContext } from '../Context/CompanyContext';



const Popular = () => {


  const { all_trucks } = useContext(CompanyContext);

  const availableTrucks = all_trucks.filter(truck => truck.available);

  const lastThreeTrucks = availableTrucks.slice(-3);


  return (
    <section className='bg-primary'>
        <div className='max_padd_container py-12 xl:w-[88%]'>
            <h3 className='h3 text-center'>Our Newest Trucks</h3>
            <hr className='h-[3px] md:w-1/2 mx-auto bg-gradient-to-l from-transparent via-black to-transparent mb-16'/>
            {/* CONTAINER */}
            <div className='grid grid-cols-1 xs:grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6'> 
                {lastThreeTrucks.map((item) => (
                    <Item key={item.id} id={item.id} image={item.image} name={item.name} info={item.info} gcw={item.gcw}/>
                ))}
            </div>
        </div>
    </section>
    
  )
}

export default Popular