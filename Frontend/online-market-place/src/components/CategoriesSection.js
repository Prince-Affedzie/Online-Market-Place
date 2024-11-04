import React from 'react';
import './CategoriesSection.css'; // Import the CSS for styling
import { Link } from 'react-router-dom';

const CategoriesSection = () => {
  // Updated category data structure with subcategories
  const categories = [
    { 
      id: 1, 
      name: 'Computing', 
      subcategories: ['Laptop', 'Desktops', 'Printers', 'Networking Devices']
    },
    { 
      id: 2, 
      name: 'Mobile Phones', 
      subcategories: ['Smartphones', 'Accessories', 'Tablets']
    },
    { 
      id: 3, 
      name: 'Electronics', 
      subcategories: ['TV', 'Cameras', 'Audio Equipment']
    },
    { 
      id: 4, 
      name: 'Fashion', 
      subcategories: ['Men\'s Wear', 'Women\'s Wear', 'Accessories']
    },
    { 
      id: 5, 
      name: 'Home Appliances', 
      subcategories: ['Refrigerator', 'Microwaves', 'Washers', 'Vacuum Cleaners']
    },
    { 
      id: 6, 
      name: 'Beauty', 
      subcategories: ['Make Up', 'Skin Care', 'Haircare', 'Fragrance']
    },
    { 
      id: 7, 
      name: 'Sports & Outdoors', 
      subcategories: ['Fitness', 'Outdoor Gear', 'Sports Equipment']
    }
  ];

  return (
    <section className="categories-section">
     
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <Link to={`/products/${category.name}`} className="category-link">
              <p>
                {category.name}
                
              </p>
            </Link>
            {/* Subcategory hover menu */}
            <div classsName ='subcategory-wrapper'>
              <ul className="subcategory-list">
              {category.subcategories.map((subcategory, index) => (
                <li key={index}>
                  <Link to={`/products/${category.name}/${subcategory}`} className="subcategory-link">
                    {subcategory}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;
