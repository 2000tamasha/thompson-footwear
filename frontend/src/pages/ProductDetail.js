// ProductDetail.js - Updated by Sharan Adhikari 24071844

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';
import axios from 'axios';
import { useCart } from '../context/cartContext';

const sizes = [
  'US 6', 'US 6.5', 'US 7', 'US 7.5', 'US 8', 'US 8.5',
  'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11',
  'US 11.5', 'US 12', 'US 12.5', 'US 13', 'US 14'
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err));
  }, [id]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="product-detail">
      <div className="image-col">
        <img src={`/${product.image_url}`} alt={product.name} />
      </div>

      <div className="details-col">
        <h1>{product.name}</h1>
        <h2>${product.price}</h2>

        {/* ✅ Dynamic Color Options */}
        {product.color_variants && (
          <p className="color-options">
            <strong>Color Options:</strong><br />
            {product.color_variants.split(",").map((color, i) => (
              <span key={i}>{color.trim()}<br /></span>
            ))}
          </p>
        )}

        {/* ✅ Size Selector */}
        <div className="size-selector">
          <p><strong>Select Size</strong> <a href="#">Size Guide</a></p>
          <div className="size-options">
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={selectedSize === size ? 'selected' : ''}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button className="add-to-cart" onClick={() => addToCart(product)}>
          Add to Bag
        </button>
        <button className="fav-btn">❤️ Favourite</button>

        <p className="promo-note">
          This product is excluded from site promotions and discounts.<br />
          This product is made with at least 20% recycled content by weight.
        </p>

        {/* ✅ Long Description and Style Code */}
        <div className="description">
          <p>{product.long_description}</p>
          {product.style_code && (
            <p><strong>Style Code:</strong> {product.style_code}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
