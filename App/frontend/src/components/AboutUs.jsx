
import { NavLink } from 'react-router-dom'
import { MdStar } from 'react-icons/md'

const AboutUs = () => {
    return (
      <section className='relative bg-peoplebanner bg-center bg-no-repeat xs:h-[520px] xl:h-[400px] w-full pb-12 bg-cover'>
        {/* Overlay for background opacity */}
        <div className='absolute inset-0 bg-black opacity-45'></div>
  
        {/* Content that won't be affected by the background opacity */}
        <div className='relative max_padd_container top-28 xs:top-44'>
          <div className="flex justify-between items-start flex-col xl:flex-row">
            <h1 className='h1 text-left capitalize max-w-[34rem] text-white'>
              Our Mission
            </h1>
            <p className='text-white xs:text-left xl:text-right regular-16 mt-6 max-w-[37rem]'>
              At Nimpression Logistics, our mission is to deliver exceptional logistics services that meet the diverse needs of our clients. We strive to create value through innovative solutions, superior customer service, and a commitment to sustainability and operational efficiency.
            </p>
          </div>
        </div>
      </section>
    )
  }
  

export default AboutUs