import { Link } from 'react-router-dom';
import FOOTER_LINKS from '../assets/footer_links';
import FOOTER_CONTACT_INFO from '../assets/footer_contact';

const Footer = () => {
  return (
    <footer className='flexCenter pb-24 pt-20 px-20'>
      <div className='max-padd-container flex w-full flex-col gap-14'>
        <div className='flex flex-col items-start justify-center gap-8 md:flex-row md:items-start'>
          <Link to="/" className="mb-10 bold-20">Nimpression</Link>
          <div className="flex flex-wrap gap-8 sm:justify-between md:flex-1 md:flex-wrap">
            {FOOTER_LINKS.map((col) => (
              <FooterColumn title={col.title} key={col.title}>
                <ul className="flex flex-col gap-4 regular-14 text-gray-20">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.url}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}
            <FooterColumn title={FOOTER_CONTACT_INFO.title}>
              <div className='flex flex-col gap-5'>
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <div key={link.label} className='flex flex-col gap-2 regular-14 text-gray-20 lg:flex-row'>
                    <p>{link.label}:</p>
                    <p className='medium-14 text-gray-20'>{link.value}</p>
                  </div>
                ))}
              </div>
            </FooterColumn>
          </div>
        </div>
        <div className='border bg-gray-20'></div>
        <p className='text-center regular-14 text-gray-30'>2024 Nimpression Ltd | All rights reserved.</p>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-5 w-full md:w-auto">
      <h4 className="bold-18 whitespace-nowrap">{title}</h4>
      {children}
    </div>
  );
};

export default Footer;
