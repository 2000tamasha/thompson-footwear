// Newsletter.js – Created by Sharan Adhikari

import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = () => {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !valid.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setShowMessage(true);
    setError('');
    setEmail('');
  };

  return (
    <div className="newsletter-container">
      <h2>Subscribe to Our Newsletter</h2>
      <p>Get exclusive deals and 10% off your first order!</p>

      <div className="newsletter-form">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSubscribe}>Subscribe</button>
      </div>

      {error && <p className="newsletter-error">{error}</p>}

      {showMessage && (
        <div className="newsletter-modal">
          <div className="newsletter-modal-content">
            <h3>🎉 Thank you for subscribing!</h3>
            <p>You'll receive exclusive deals and updates in your inbox.</p>
            <button onClick={() => setShowMessage(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;
