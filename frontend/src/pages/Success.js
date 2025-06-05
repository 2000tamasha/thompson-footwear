import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px',
      fontFamily: 'Arial'
    }}>
      <h1>🎉 Thank you for your order!</h1>
      <p>Your payment was successful and your order is being processed.</p>
      <p>You will receive an email confirmation shortly.</p>

      <Link to="/" style={{
        marginTop: '20px',
        display: 'inline-block',
        padding: '12px 20px',
        backgroundColor: 'black',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px'
      }}>
        Continue Shopping
      </Link>
    </div>
  );
};

export default Success;
