import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './Home.css';
import Footer from '../components/Footer';
import HomeNavBar from '../components/HomeNavBar';
import CategoriesSection from '../components/CategoriesSection';
import VendorSpotlight from '../components/VendorSpotlight';
import TrendingProductsCarousel from '../components/TrendingProducts';
import { ProductsContext } from '../Context/ProductsViewContext';

const Home = () => {
  const { products, fetchProducts1, loading, fetchStores, stores } = useContext(ProductsContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [categories, setCategories] = useState(['Electronics', 'Home Appliances', 'Fashion', 'Mobile Phones', 'Beauty', 'Computing']);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    fetchProducts1();
    fetchStores();
  }, [fetchProducts1, fetchStores]);

  useEffect(() => {
    const groupedProducts = {};
    products.forEach((product) => {
      const category = product.category;
      if (!groupedProducts[category]) {
        groupedProducts[category] = [];
      }
      groupedProducts[category].push(product);
    });
    setProductsByCategory(groupedProducts);
    setFilteredProducts(products);
    console.log(stores)
    setFilteredStores(stores);
  }, [products, stores]);

  return (
    <div className="home-page">
      <HomeNavBar />
      <div className="container">
        <aside className="sidebar">
          <CategoriesSection />
        </aside>
        <main className="main-content">
          <section className="hero-section">
            <div className="hero-content">
              <h1>Discover Amazing Products & Stores</h1>
              <p>Your one-stop marketplace for the best products from trusted sellers.</p>
              <button onClick={() => navigate('/home')} className="cta-button">Start Shopping</button>
            </div>
          </section>
        </main>
      </div>

      {/* Full-width sections */}
      <div className="full-width-section">
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <TrendingProductsCarousel />
            {categories.map((category) => (
              <section className="category-section" key={category}>
                <div className='category-header'>
                  <h4 className="category-title">{category}</h4>
                  <Link to={`/products/${category}`} className="category-link">
                    {'See All >'}
                  </Link>
                </div>
                <div className="product-list-h">
                  {productsByCategory[category]?.slice(0, 5).map((product) => (
                    <div key={product._id} className="product-item">
                      <Link to={`/productdetails/${product._id}`} style={{ textDecoration: 'none' }}>
                        {product.images && product.images.length > 0 && (
                          <img
                            src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
                            alt={product.title}
                          />
                        )}
                        <h3>{product.title}</h3>
                        <p>GH₵ {product.price}</p>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Vendor Spotlight for the current category */}
     <div className="vendor-spotlight">
  
      <VendorSpotlight
      categoryStores={filteredStores.filter(store => 
        (store.store_category && store.store_category.toLowerCase().includes(category.toLowerCase()))|| 
        (store.store_name && store.store_name.toLowerCase().includes(category.toLowerCase()))
      )}
    />
    
</div>

              </section>
            ))}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
