
import { useContext } from 'react'
import { CompanyContext } from '../Context/CompanyContext'
import { useParams } from 'react-router-dom'
import ProductDisplay from '../components/ProductDisplay'
import ProductHd from '../components/ProductHd'


const Truck = () => {

    const {all_trucks} = useContext(CompanyContext);
    const {truckID} = useParams();

    console.log("Truck ID:", truckID);
    console.log("All Products:", all_trucks);

    const truck = all_trucks.find((e) => e.id === Number(truckID));
    if (!truck) {
        return <div>Truck not found</div>
    }

    return (
      <section className="max_padd_container py-28">
        <div>
          <ProductHd truck={truck}/>
          <ProductDisplay truck={truck}/>
        </div>
      </section>
    )
}

export default Truck