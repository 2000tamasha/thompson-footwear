import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

const Home = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  const search = queryParams.get('search');

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable for API URL, fallback to Railway URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://thompson-footwear-production.up.railway.app';
  
  // Debug: Log the API URL being used
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('REACT_APP_API_URL from env:', process.env.REACT_APP_API_URL);
  
  // Test backend connectivity
  useEffect(() => {
    const testBackend = async () => {
      try {
        console.log('Testing backend connectivity...');
        const response = await fetch(`${API_BASE_URL}/api/products`);
        console.log('Backend test response status:', response.status);
        if (response.ok) {
          console.log('✅ Backend is accessible');
        } else {
          console.log('❌ Backend returned error:', response.status, response.statusText);
        }
      } catch (error) {
        console.log('❌ Backend connectivity test failed:', error.message);
      }
    };
    
    testBackend();
  }, [API_BASE_URL]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = category
          ? `${API_BASE_URL}/api/products?category=${category}`
          : `${API_BASE_URL}/api/products`;

        console.log('Attempting to fetch from URL:', url);
        
        const res = await axios.get(url);
        console.log('Successfully fetched products:', res.data);
        
        // Ensure response is an array
        const productsData = Array.isArray(res.data) ? res.data : [];
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching products:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response,
          request: err.request,
          config: err.config
        });
        
        if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
          setError('Network error. Please check if the backend server is running.');
        } else if (err.response) {
          setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
        } else {
          setError('Failed to load products. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, API_BASE_URL]);

  useEffect(() => {
    if (search && Array.isArray(products)) {
      const filteredProducts = products.filter(product =>
        product.name && product.name.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredProducts);
    } else {
      setFiltered(Array.isArray(products) ? products : []);
    }
  }, [products, search]);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Poppins', marginTop: '75px', textAlign: 'center' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Poppins', marginTop: '75px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins', marginTop: '75px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontFamily: 'Poppins' }}>
        {search
          ? `Results for "${search}"`
          : category
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : 'All'} Shoes
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {Array.isArray(filtered) && filtered.length > 0 ? (
          filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products match your search.</p>
        )}
      </div>
    </div>
  );
};

export default Home;