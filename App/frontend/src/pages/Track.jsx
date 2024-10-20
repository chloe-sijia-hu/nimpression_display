import { NavLink } from "react-router-dom"

const Track = () => {
  return (
    <section className="max_padd_container flexCenter flex-col pt-32 pb-5">
    <div className="xs:w-full xl:w-3/4 md:w-3/4 h-auto bg-white m-auto px-14 py-10 rounded-md">
      <h3 className="h3">Track Your Order</h3>
      <div className="flex flex-col gap-4 mt-7">
        <div className="flexBetween rounded-full ring-1 ring-slate-900/10 hover:ring-slate-900/15 bg-primary w-full max-w-[588px]">
            <input type="text" placeholder="Please enter your tracking number here" className="w-full bg-transparent ml-7 border-none outline-none regular-16 "/>
            <button className="btn_dark_rounded">Track</button>
        </div>
        <p className="text-black font-bold mt-3">Have Questions? 
          <span className="text-secondary underline cursor-pointer"><NavLink to={`/contact`}>Contact Us</NavLink></span>
        </p>
   
      </div>
    </div>
  </section>
  )
}

export default Track