// CheckoutModal.js – Updated by Sharan Adhikari to support unified checkout with checkout flag

import React from 'react';

const CheckoutModal = ({ onClose, user }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        width: '300px'
      }}>
        <h3>How would you like to checkout?</h3>

        {/* Unified guest & user logic trigger */}
        <button 
          onClick={() => {
            onClose();
            window.dispatchEvent(new Event("openGuestCheckout"));
          }}
          style={{ margin: "10px", padding: "10px 15px", backgroundColor: "black", fontFamily: 'Poppins', color: "white", border: "none", cursor: "pointer" }}
        >
          Checkout as Guest
        </button>

        <button 
          onClick={() => {
            onClose();
            if (user) {
              window.dispatchEvent(new Event("openUserCheckout"));
            } else {
              window.location.href = "/login?checkout=1"; 
            }
          }}
          style={{ margin: "10px", padding: "10px 15px", backgroundColor: "black", fontFamily: 'Poppins', color: "white", border: "none", cursor: "pointer" }}
        >
          Sign In & Checkout
        </button>

        <br />
        <button 
          onClick={onClose}
          style={{ marginTop: "20px", background: "none", color: "red", border: "none", fontFamily: 'Poppins' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
