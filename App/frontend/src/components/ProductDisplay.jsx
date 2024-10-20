import { useContext } from "react"
import { MdStar } from "react-icons/md"
import { CompanyContext } from "../Context/CompanyContext"
import delivery1 from '../assets/delivery1.jpg'
import { Link } from "react-router-dom"

const ProductDisplay = (props) => {

    const {truck} = props;

  return (
    <section>
      <div className="flex flex-col gap-14 xl:flex-row">
                {/* left side */}
                <div className="flex gap-x-2 xl:flex-1">
                    <div>
                        <img src={truck.image} alt="" />
                    </div>
                </div>
                {/* right side */}
                <div className="flex-col flex xl:flex-[1.7]">
                    <h3 className="h3 ">{truck.name}</h3>
                    <div className="flex gap-x-2 text-secondary medium-22">
                        <MdStar />
                        <MdStar />
                        <MdStar />
                        <MdStar />
                        <MdStar />
                        {/* <p>(111)</p> */}
                    </div>
                    <div className="flex gap-x-6 medium-20 my-2">
                    </div>
                    <div className="mb-4">
                        <div className="flex gap-5 my-1">
                          <h4 className="bold-16">Storage Size:</h4>
                          <div className="text-secondary"> {truck.wide}m * {truck.high}m * {truck.long}m</div>
                        </div>
                        <div className="flex gap-5 my-1">
                          <h4 className="bold-16">Maximum Capacity:</h4>
                          <div className="text-secondary">{truck.capacity} m³ & {truck.gcw} kg</div>
                        </div>
                        <div className="flex gap-5 my-1">
                          <h4 className="bold-16">Details:</h4>
                          <div className="text-secondary">{truck.info}</div>
                        </div>
                        <div className="flex flex-col gap-y-3 mb-4 max-w-[555px] mt-4">
                            <button className="btn_dark_outline !rounded-none uppercase regular-14 tracking-widest"><Link to='/booking'>Get Your Quote</Link></button>
                            <button className="btn_dark_rounded !rounded-none uppercase regular-14 tracking-widest"><Link to='/contact'>Contact Us</Link></button>
                        </div>
                    </div>
                </div>
      </div>
    </section>
  )
}

export default ProductDisplay