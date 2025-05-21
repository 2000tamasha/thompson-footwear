// ProductDetail.js – Enhanced with Favourites by Sharan Adhikari 24071844

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product", err);
        setProduct({});
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const productToAdd = { ...product, selectedSize, quantity };
    addToCart(productToAdd);
    setShowAddedModal(true);
  };

  const handleAddToFavourites = () => {
    let favs = JSON.parse(localStorage.getItem('favourites')) || [];
    const alreadyExists = favs.find(item => item.id === product.id);
    if (!alreadyExists) {
      favs.push(product);
      localStorage.setItem('favourites', JSON.stringify(favs));
    }
    setShowFavModal(true);
  };

  const handleQuantityChange = (type) => {
    setQuantity(prev => type === 'inc' ? prev + 1 : Math.max(1, prev - 1));
  };

  if (!product) return <p>Loading product...</p>;
  if (Object.keys(product).length === 0) return <p>Product not found.</p>;

  return (
    <div className="product-detail">
      <button onClick={() => navigate('/products')} style={{ margin: '10px 0' }}>
        ← Back to Shop
      </button>

      <div className="image-col">
        <img src={`/${product.image_url}`} alt={product.name} />
      </div>

      <div className="details-col">
        <h1>{product.name}</h1>
        <h2>${product.price}</h2>
        <p><strong>Status:</strong> In stock</p>

        {product.color_variants && (
          <p className="color-options">
            <strong>Color Options:</strong><br />
            {product.color_variants.split(",").map((color, i) => (
              <span key={i}>{color.trim()}<br /></span>
            ))}
          </p>
        )}

        <div className="size-selector">
          <p><strong>Select Size</strong> <button onClick={() => setShowSizeGuide(true)} className="size-guide-link">Size Guide</button></p>
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

        <div className="quantity-selector">
          <p><strong>Quantity:</strong></p>
          <div className="qty-controls">
            <button onClick={() => handleQuantityChange('dec')}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange('inc')}>+</button>
          </div>
        </div>

        <button
          className="add-to-cart"
          onClick={handleAddToCart}
          disabled={!selectedSize}
        >
          Add to Bag
        </button>
        <button className="fav-btn" onClick={handleAddToFavourites}>
          ❤️ Favourite
        </button>

        <p className="promo-note">
          This product is excluded from site promotions and discounts.<br />
          This product is made with at least 20% recycled content by weight.
        </p>

        <div className="description">
          <p>{product.long_description}</p>
          {product.style_code && (
            <p><strong>Style Code:</strong> {product.style_code}</p>
          )}
        </div>
      </div>

      {showSizeGuide && (
        <div className="newsletter-modal">
          <div className="newsletter-modal-content">
            <h3>📏 Size Guide</h3>
            <p>US Sizes correspond to foot lengths in inches.<br />If you're in between sizes, go one up!</p>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>US 6 = 9.25”</li>
              <li>US 7 = 9.625”</li>
              <li>US 8 = 9.9375”</li>
              <li>US 9 = 10.25”</li>
              <li>US 10 = 10.5625”</li>
              <li>US 11 = 10.9375”</li>
              <li>US 12 = 11.25”</li>
            </ul>
            <button onClick={() => setShowSizeGuide(false)}>Close</button>
          </div>
        </div>
      )}

      {showAddedModal && (
        <div className="newsletter-modal">
          <div className="newsletter-modal-content">
            <h3> Added to Bag!</h3>
            <p>{product.name} (Size {selectedSize}, Qty {quantity})</p>
            <button onClick={() => setShowAddedModal(false)}>OK</button>
          </div>
        </div>
      )}

      {showFavModal && (
        <div className="newsletter-modal">
          <div className="newsletter-modal-content">
            <h3>❤️ Added to Favourites!</h3>
            <p>{product.name} is now in your favourites list.</p>
            <button onClick={() => setShowFavModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;