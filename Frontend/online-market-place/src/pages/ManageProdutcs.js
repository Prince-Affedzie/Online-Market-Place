// src/pages/SellerProductManagement.js
import React, { useEffect, useState } from 'react';
import { Link,useParams,useNavigate } from 'react-router-dom';
import './ManageProducts.css';
import SellerNavbar from '../components/SellerNavbar';

const Backend = 'http://localhost:3000';

const SellerProductManagement = () => {
  const navigate = useNavigate()
  const { storeId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${Backend}/api/marketplace/seller/getproducts/${storeId}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  

  const handleDelete = async(productId)=>{
    try{
     const response = await fetch(`${Backend}/api/marketplace/seller/deleteproduct/${productId}`,
      {
        method: 'DELETE',
        credentials:'include'
      }
     )
     if(response.ok){
      alert('Product Removed Successfully')
      
     
     }}catch(err){
      console.log(err)
     }
  }

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="products-management">
      <SellerNavbar/>
      <header className="page-header">
        <h1>Manage Your Products</h1>
        <Link to={`/seller/addproduct/${storeId}`} className="add-product-btn">Add New Product</Link>
      </header>

      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div className="product-card" key={product._id}>
             {product.images && product.images.length > 0 && (
                      <img
                        src={`http://localhost:3000/uploads/productImages/${product.images[0]}`}
                        alt={product.title}
                      />
                    )}
              <h3>{product.title}</h3>
              <p>Price: GH$ {product.price}</p>
              <p>Stock: {(product.stock? product.stock : 0)}</p>
              <p>Sales: {(product.sales? product.sales:0)}</p>
              <div className="product-actions">
                <Link to={`/seller/editproduct/${product._id}`} className="edit-btn">Edit</Link>
                <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerProductManagement;
