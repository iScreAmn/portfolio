"use client";

import { 
  brand1, 
  brand2, 
  brand3, 
  brand4, 
  brand5, 
  brand6, 
  brand7, 
  brand8, 
  brand9 
} from '../../assets/images';
import { useLocaleHomeData } from "../../hooks/useLocaleHomeData";
import '../section-title/SectionTitle.css';
import './Brands.css';

const Brands = () => {
  const { brandsSectionData } = useLocaleHomeData();
  const brands = [
    { logo: brand1, name: 'AskChef', url: '#' },
    { logo: brand2, name: 'Balu', url: '#', darkOnLightHover: true },
    { logo: brand3, name: 'Burger House', url: '#', darkOnLightHover: true },
    { logo: brand4, name: 'Coffee Shop', url: '#', darkOnLightHover: true }, 
    { logo: brand5, name: 'Diagnoz', url: '#' },
    { logo: brand6, name: 'GPS', url: '#' },
    { logo: brand7, name: 'Impera', url: '#', darkOnLightHover: true},
    { logo: brand8, name: 'Law Firm', url: '#' },
    { logo: brand9, name: 'Portfolio', url: '#' },
  ];

  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

  const renderBrandItem = (brand, index) => (
    <div
      key={`${brand.name}-${index}`}
      className={`brands__item ${brand.darkOnLightHover ? 'brands__item--dark-hover' : ''}`}
      aria-label={brand.name}
    >
      <img
        src={brand.logo}
        alt={brand.name}
        className="brands__logo"
        loading="lazy"
      />
    </div>
  );

  return (
    <section className="brands" id="brands">
      <div className="container brands__container">
        <div className="brands__header">
          <h2 className="inner-title">{brandsSectionData.sectionTitle}</h2>
          <h3 className="inner-subtitle">{brandsSectionData.sectionSubtitle}</h3>
        </div>
        <div className="brands__carousel">
          <div className="brands__track">
            {duplicatedBrands.map((brand, index) => 
              renderBrandItem(brand, index)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brands;
