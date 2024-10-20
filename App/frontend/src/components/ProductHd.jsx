import {TbArrowRight} from "react-icons/tb"
import { NavLink } from "react-router-dom"

const ProductHd = (props) => {

    const {truck} = props;

  return (
    <div className="flex items-center flex-wrap gap-x-2 medium-16 my-4 capitalize">
         <NavLink to={"/"}>Home</NavLink> <TbArrowRight /> {truck.name}
    </div>
  )
}

export default ProductHd