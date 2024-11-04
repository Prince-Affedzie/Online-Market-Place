import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import HomeNavBar from '../components/HomeNavBar';
import Footer from '../components/Footer';
import { ProductsContext } from '../Context/ProductsViewContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import VendorSpotlight from '../components/VendorSpotlight';
import './ProductsCategoryPage.css';

const Backend = 'http://localhost:3000';

const ProductsCategoryPage = () => {
  const { stores } = useContext(ProductsContext);
  const { category } = useParams();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setError(null);
      try {
        const response = await fetch(`${Backend}/api/marketplace/buyer/getbycategory/${category}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [category]);

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(`${Backend}/api/marketplace/buyer/addtocart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId }),
        credentials: 'include'
      });
      if (response.ok) {
        toast.success('Product Added to Cart!')
      } else {
        console.error('Failed to add product to cart:', response.statusText);
        toast.error('Failed to add product to cart.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSortChange = (e) => setSortOption(e.target.value);

  const filteredProducts = products
    .filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'price') return a.price - b.price;
      if (sortOption === 'popularity') return b.popularity - a.popularity; // Adjust based on data availability
      if (sortOption === 'rating') return b.rating - a.rating;
      return 0;
    });

  if (loadingProducts) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="products-page">
      <HomeNavBar />
      <ToastContainer /> 
      <h2>{category}</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search Products..."
          className="search-bar"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="filter-options">
          <label>Sort by:</label>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="price">Price</option>
            <option value="popularity">Popularity</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div className="product-card" key={product._id}>
            <Link to={`/productdetails/${product._id}`} style={{ textDecoration: 'none' }}>
              {product.images && product.images.length > 0 && (
                <img
                  src={`${Backend}/uploads/productImages/${product.images[0]}`}
                  alt={product.title}
                />
              )}
              <h3 className="product-name">{product.title}</h3>
              <p className="product-price">GH₵ {product.price}</p>
            </Link>
            <button className="add-to-cart" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="vendor-spotlight">
        <VendorSpotlight
          categoryStores={stores.filter(store => 
            store.store_category.toLowerCase().includes(category.toLowerCase()) ||
            store.store_name.toLowerCase().includes(category.toLowerCase())
          )}
        />
      </div>

      <Footer />
    </div>
  );
};

export default ProductsCategoryPage;
