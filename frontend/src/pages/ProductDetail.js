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
  const [average, setAverage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const { addToCart } = useCart();
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // FIXED: Updated API URL configuration to match other components
  const API_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://thompson-footwear-production.up.railway.app'
      : 'http://localhost:5000');

  useEffect(() => {
    axios.get(`${API_URL}/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product", err);
        setProduct({});
      });
  }, [id, API_URL]);

  useEffect(() => {
    axios.get(`${API_URL}/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Error fetching reviews:", err));
    
    axios.get(`${API_URL}/api/reviews/${id}/average`)
      .then(res => setAverage(res.data.average || 0))
      .catch(err => console.error("Error fetching average rating:", err));
  }, [id, API_URL]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!userEmail || !reviewText) {
      alert('❌ Please enter your email and comment.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/reviews/${id}`, {
        user_email: userEmail,
        rating: 5, // Optional default
        review_text: reviewText
      });

      setUserEmail('');
      setReviewText('');

      // Show custom success modal
      setShowReviewSuccess(true);
      setTimeout(() => setShowReviewSuccess(false), 3000); // auto-hide after 3s

      // Refresh reviews and average
      const resReviews = await axios.get(`${API_URL}/api/reviews/${id}`);
      const resAvg = await axios.get(`${API_URL}/api/reviews/${id}/average`);
      setReviews(resReviews.data);
      setAverage(resAvg.data.average || 0);
    } catch (err) {
      console.error('Review submission failed:', err);
      alert('❌ Failed to submit review. Please try again.');
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    const productToAdd = { ...product, selectedSize, quantity };
    addToCart(productToAdd);
    setShowAddedModal(true);
  };

  const handleAddToFavourites = () => {
    try {
      let favs = JSON.parse(localStorage.getItem('favourites')) || [];
      const alreadyExists = favs.find(item => item.id === product.id);
      if (!alreadyExists) {
        favs.push(product);
        localStorage.setItem('favourites', JSON.stringify(favs));
        setShowFavModal(true);
      } else {
        alert('This item is already in your favourites!');
      }
    } catch (error) {
      console.error('Error adding to favourites:', error);
      alert('Failed to add to favourites.');
    }
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

        <button className="add-to-cart" onClick={handleAddToCart} disabled={!selectedSize}>
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
          {product.style_code && <p><strong>Style Code:</strong> {product.style_code}</p>}
        </div>
      </div>

      {showSizeGuide && (
        <div className="newsletter-modal">
          <div className="newsletter-modal-content">
            <h3>📏 Size Guide</h3>
            <p>US Sizes correspond to foot lengths in inches.<br />If you're in between sizes, go one up!</p>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>US 6 = 9.25"</li>
              <li>US 7 = 9.625"</li>
              <li>US 8 = 9.9375"</li>
              <li>US 9 = 10.25"</li>
              <li>US 10 = 10.5625"</li>
              <li>US 11 = 10.9375"</li>
              <li>US 12 = 11.25"</li>
            </ul>
            <button onClick={() => setShowSizeGuide(false)}>Close</button>
          </div>
        </div>
      )}

      {showAddedModal && (
        <div className="newsletter-modal">
          <div className="newsletter-modal-content">
            <h3>Added to Bag!</h3>
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

      {/* --- Ratings and Reviews Section --- */}
      <div className="reviews-container">
        <h2 className="reviews-header">💬 Customer Reviews</h2>

        <div className="leave-review-section">
          <h4>Leave a review</h4>
          <form onSubmit={handleSubmitReview}>
            <input
              type="email"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
              placeholder="Your Email"
              required
            />

            <textarea
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={3}
              placeholder="Write your review..."
              required
            />

            <button type="submit">Submit Review</button>
          </form>
        </div>

        <div>
          <h4 className="all-reviews-title">All Reviews</h4>
          {reviews.length === 0 ? (
            <div className="no-reviews-message">No reviews yet.</div>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-meta">
                  {r.user_email} <span>({new Date(r.created_at).toLocaleString()})</span>
                </div>
                <div className="review-text">{r.review_text}</div>
              </div>
            ))
          )}
          {showReviewSuccess && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '30px 50px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}>
                <h2 style={{ marginBottom: '10px' }}>🎉 Thank You!</h2>
                <p>Your review has been submitted successfully.</p>
                <button
                  onClick={() => setShowReviewSuccess(false)}
                  style={{
                    marginTop: '15px',
                    padding: '8px 18px',
                    backgroundColor: '#ffa600',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;