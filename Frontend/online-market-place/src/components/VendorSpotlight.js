import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './VendorSpotlight.css';
import { ProductsContext } from '../Context/ProductsViewContext';

const VendorSpotlight = ({ categoryStores }) => {
  return (
    <div className="vendor-spotlight-container">
      <h2>Top Vendors in this Category</h2>
      <div className="vendor-grid">
        {categoryStores.map((vendor) => (
          
          <div className="vendor-card" key={vendor._id}>
            <Link to={`/storedetails/${vendor._id}`} style={{textDecoration:'none'}}>
           <img className='vendor-logo'
                    src={`http://localhost:3000/uploads/stores/${vendor.store_logo}`}
                    alt={vendor.store_name}
                    />
            <div className="vendor-info">
              <p className="vendor-name">{vendor.store_name}</p>
              <p className="vendor-rating">⭐ {vendor.rating}</p>
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorSpotlight;
