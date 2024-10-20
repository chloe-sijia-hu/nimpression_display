import React from 'react';

const Services = () => {
  return (
    <section className="max_padd_container py-12 pb-12">
      <h3 className="h3 text-center mb-8">Our Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <ServiceCard
          id="freight"
          title="Freight Transportation"
          description="Efficient freight transportation services using a fleet of reliable trucks, ensuring timely delivery across Christchurch and beyond. We tailor transportation solutions to meet your specific needs and streamline your supply chain."
        />
        <ServiceCard
          id="warehousing"
          title="Warehousing & Distribution"
          description="Secure storage solutions with easy access for efficient order fulfillment. Our advanced inventory management systems and fleet of trucks ensure your products are stored safely and delivered promptly to their final destination."
        />
        <ServiceCard
          id="supply-chain"
          title="Supply Chain Solutions"
          description="Comprehensive supply chain solutions that optimize every step of the process, from transportation to warehousing. We help businesses in Christchurch enhance their operational efficiency and reduce costs."
        />
      </div>
    </section>
  );
};

const ServiceCard = ({ id, title, description }) => {
  return (
    <div id={id} className="bg-white shadow-md rounded-lg p-6">
      <p className="bold-18 mb-1">{title}</p>
      <p className="regular-16">{description}</p>
    </div>
  );
};

export default Services;