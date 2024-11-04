import React, {useEffect,useState} from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import Footer from '../components/Footer';
import './LandingPage.css'; // Import the CSS for modern styling
const Backend = 'http://localhost:3000';

const LandingPage = () => {
  const [products,setProducts] = useState([])
  const [stores,setStores] =useState([])
  const featuredProducts = [
    { id: 1, name: 'Product 1', price: '$10', image: 'product1.jpg' },
    { id: 2, name: 'Product 2', price: '$20', image: 'product2.jpg' },
    { id: 3, name: 'Product 3', price: '$50', image: 'product1.jpg' },
    { id: 4, name: 'Product 4', price: '$30', image: 'product2.jpg' },
  ];

  const featuredStores = [
    { id: 1, name: 'Store 1', description: 'Best electronics' },
    { id: 2, name: 'Store 2', description: 'Top fashion items' },
    { id: 3, name: 'Store 3', description: 'Phones and Accessories' },
    { id: 4, name: 'Store 4', description: 'Computers' },
  ];

 useEffect(()=>{
  const fetchProducts = async()=>{
    const response = await fetch(`${Backend}/api/marketplace/buyer/getallproducts`,{
      method:'GET',
      headers:{
        "content-type" :"application/json"
      },
      credentials:"include"
    })
    if(response.ok){
      const data = await response.json()
      setProducts(data)
    }
  }
  const fetchStores = async () => {
    try {
      const response = await fetch(`${Backend}/api/marketplace/getallstores`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setStores(data);
        
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };
  fetchProducts()
  fetchStores()
 },[])

  return (
    <div>
      <NavBar />
      <Hero />
      <FeaturedSection products={products} stores={stores} />
      <Footer />
    </div>
  );
};

export default LandingPage;
