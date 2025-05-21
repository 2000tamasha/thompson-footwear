// Cart.js – Enhanced by Sharan Adhikari 24071844

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/cartContext';
import CheckoutModal from './CheckoutModal';
import GuestCheckoutModal from './GuestCheckoutModal';

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [quantities, setQuantities] = useState(cartItems.map(() => 1));

  useEffect(() => {
    const handleOpenGuest = () => setShowGuestModal(true);
    window.addEventListener('openGuestCheckout', handleOpenGuest);
    return () => window.removeEventListener('openGuestCheckout', handleOpenGuest);
  }, []);

  const handleQuantityChange = (index, delta) => {
    setQuantities(prev => {
      const updated = [...prev];
      updated[index] = Math.max(1, updated[index] + delta);
      return updated;
    });
  };

  const total = cartItems.reduce((sum, item, i) => {
    const price = parseFloat(item.price) || 0;
    return sum + price * (quantities[i] || 1);
  }, 0);

  return (
    <div style={{ padding: "40px", marginTop: '50px', fontFamily: 'Poppins' }}>
      <h2>Your Cart 🛍️</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} style={{
              display: "flex", alignItems: "center", marginBottom: "20px",
              gap: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px"
            }}>
              <img src={`/${item.image_url}`} alt={item.name} width="100" />
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p><strong>Price:</strong> ${parseFloat(item.price).toFixed(2)}</p>
                {item.selectedSize && <p><strong>Size:</strong> {item.selectedSize}</p>}
                {item.style_code && <p><strong>Style Code:</strong> {item.style_code}</p>}
                {item.description && <p style={{ maxWidth: '400px' }}>{item.description}</p>}

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong>Quantity:</strong>
                  <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                  <span>{quantities[index]}</span>
                  <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                </div>

                <button onClick={() => removeFromCart(index)} style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  fontFamily: 'Poppins',
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}>Remove</button>
              </div>
            </div>
          ))}

          <h3>Total: ${total.toFixed(2)}</h3>

          <button
            onClick={() => setShowModal(true)}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "black",
              fontFamily: 'Poppins',
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Go to Checkout
          </button>
        </div>
      )}

      {showModal && <CheckoutModal onClose={() => setShowModal(false)} />}
      {showGuestModal && <GuestCheckoutModal onClose={() => setShowGuestModal(false)} />}
    </div>
  );
};

export default Cart;