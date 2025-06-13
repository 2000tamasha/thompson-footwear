import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/cartContext';

const Success = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart both from state and localStorage on successful checkout
    clearCart();
  }, [clearCart]);

  return (
    <div style={{
      textAlign: 'center',
      padding: '100px 20px',
      fontFamily: 'Poppins',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        backgroundColor: '#f8f9fa',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#28a745', 
          marginBottom: '20px',
          fontSize: '2.5rem'
        }}>
          🎉 Thank you for your order!
        </h1>
        
        <p style={{ 
          fontSize: '18px', 
          color: '#666', 
          marginBottom: '15px',
          lineHeight: '1.5'
        }}>
          Your payment was successful and your order is being processed.
        </p>
        
        <p style={{ 
          fontSize: '16px', 
          color: '#666', 
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          You will receive an email confirmation shortly with your order details and tracking information.
        </p>

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: 'black',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'background-color 0.2s',
            fontFamily: 'Poppins'
          }}>
            Continue Shopping
          </Link>

          <Link to="/products" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: 'white',
            color: 'black',
            border: '2px solid black',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '16px',
            transition: 'all 0.2s',
            fontFamily: 'Poppins'
          }}>
            View All Products
          </Link>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e7f3ff',
          borderRadius: '8px',
          border: '1px solid #b8daff'
        }}>
          <h3 style={{ color: '#004085', marginBottom: '10px' }}>What's Next?</h3>
          <ul style={{ 
            textAlign: 'left', 
            color: '#004085',
            lineHeight: '1.6',
            paddingLeft: '20px'
          }}>
            <li>Order confirmation will be sent to your email</li>
            <li>Your order will be processed within 1-2 business days</li>
            <li>You'll receive tracking information once shipped</li>
            <li>Expected delivery: 3-7 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Success;