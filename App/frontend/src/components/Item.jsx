import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const Item = ({id, name, info, gcw, image}) => {
  return (
    <div className='rounded-xl overflow-hidden shadow-lg'>
        <div className='relative flexCenter group transition-all duration-100'>
            <Link to={`/truck/${id}`} className='h-12 w-12 bg-white rounded-full flexCenter absolute top-1/2 bottom-1/2 !py-2 z-20 scale-0 group-hover:scale-100 transition-all duration-700'>
            <FaSearch className='scale-125 hover:rotate-90 transition-all duration-200'/>
            </Link>
            <img onClick={window.scrollTo(0, 0)} src={image} alt={name} className='w-full max-h-40 block object-cover group-hover:scale-110 transition-all duration-1000' />
        </div>
        <div className='p-4 overflow-hidden'>
            <h4 className='my-[6px] medium-16 text-gray-50 line-clamp-2'>{info} - {name}</h4>
            <div className='flex gap-5'>
                <div className='text-gray-30'>Maximum Weight: {gcw}</div>
            </div>
        </div>
    </div>
  )
}

export default Item