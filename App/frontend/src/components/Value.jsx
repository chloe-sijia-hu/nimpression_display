import VALUE from '../assets/value';

const Value = () => {
  return (
    <section className="relative w-full px-4 py-24 mt-16">
    <div className="absolute inset-0 bg-gradient-to-t from-slate-400/30 to-slate-400/70"></div>
      <h3 className='h2 text-left relative max_padd_container text-white z-10'>Our Value</h3>
      <div className={`absolute inset-0 bg-cover bg-center`}></div>
      <div className="relative max_padd_container z-5">

        <div className="flex flex-wrap gap-8 sm:justify-between md:flex-1 md:flex-wrap items-start">
            <ul className="flex flex-wrap sm:justify-between md:flex-1 md:flex-wrap items-start xs:w-[450px]">
                {VALUE.map((col) => (
                    <div className='flex gap-5 test-left xs:flex-col xl:flex-col py-3 regular-16 z-15 max-w-56'>
                        <li key={col.core_value}>
                            <p className='text-white bold-18 mb-1'>{col.core_value}: </p>
                            <p className='text-white'>{col.detail}</p>
                        </li>
                    </div>
                ))}
            </ul>
        </div>
      </div>
    </section>


  )
}

export default Value