
import { NavLink } from 'react-router-dom'
import { MdStar } from 'react-icons/md'

const Hero = () => {
  return (
    <section className='relative bg-hero bg-center bg-no-repeat h-[811px] w-full pb-12 bg-cover'>
        <div className='max_padd_container relative top-28 xs:top-44'>
            <h1 className='h1 capitalize max-w-[34rem] text-white'>
                Your trusful choice for delivery
            </h1>
            <p className='text-white regular-16 mt-6 max-w-[37rem]'>
            Nimpression Logistics is a dynamic and forward-thinking logistics company based in Christchurch, New Zealand. Since our founding in 2016, we have been dedicated to providing reliable and efficient transportation solutions to businesses across the region. Our commitment to excellence and customer satisfaction has positioned us as a trusted partner for our clients' logistics needs.
            </p>
            <div className='flexStart !items-center gap-x-4 my-10' style={{ color: 'white' }}>
                <div className='!regular-24 flexCenter gap-x-1'>
                    <MdStar />
                    <MdStar />
                    <MdStar />
                    <MdStar />
                    <MdStar /> 
                </div>
                <div>
                    <div className='bold-16 sm:bold-20'>100+<span className='regular-16 sm:regular-20'>Excellent Review</span></div>
                </div>
            </div>
            <div className='max-xs:flex-col flex gap-2'>
                <NavLink to={'/contact'} className={"btn_dark_rounded flex-center"}>
                    Contact Us
                </NavLink>
                <NavLink to={'/booking'} className={"btn_secondary_rounded flex-center gap-x-2"}>
                    Get a Quote Now
                </NavLink>
            </div>
        </div>
    </section>
  )
}

export default Hero