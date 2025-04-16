//24071844 sharan adhikari

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `http://localhost:5000/products?category=${category}`
          : `http://localhost:5000/products`;

        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (search) {
      const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
      setFiltered(filteredProducts);
    } else {
      setFiltered(products);
    }
  }, [products, search]);

  return (
    <div style={{ padding: '20px' , fontFamily:'Poppins', marginTop:'75px'}}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px',fontFamily:'Poppins' }}>
        {search
          ? `Results for "${search}"`
          : category
          ? category.charAt(0).toUpperCase() + category.slice(1)
          : 'All'} Shoes
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filtered.length > 0 ? (
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
