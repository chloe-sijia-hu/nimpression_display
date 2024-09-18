import { NavLink } from "react-router-dom"

const ContactUs = () => {
  return (
    <section className="max_padd_container flexCenter flex-col pt-32 pb-5">
      <div className="xs:w-full xl:w-3/4 md:w-3/4 h-[600px] bg-white m-auto px-14 py-10 rounded-md">
        <h3 className="h3">Contact Us</h3>
        <div className="flex flex-col gap-4 mt-7">
          <input type="text" placeholder="Please Enter Your Name" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"/>
          <input type="email" placeholder="Please Enter Your Email" className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"/> 
          <textarea type="text" placeholder="Please Enter Your Message" className="h-44 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"></textarea>
          <button className="btn_secondary_rounded my-5 w-full !rounded-md">Submit</button>
          <p className="text-black text-slate-700">Or you can reach us by phone at <strong>021-792-597</strong> or by email at <strong>nimpressionltd@outlook.com</strong>.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ContactUs