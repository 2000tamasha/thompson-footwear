// ForgotPassword.js – Updated with Back to Login by Sharan Adhikari

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset link sent to:", email);
    setSubmitted(true);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '150px auto',
      padding: '30px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Reset Your Password</h2>

      {submitted ? (
        <>
          <p style={{ marginBottom: '20px' }}>
             A password reset link has been sent to your email address.
          </p>
          <button onClick={() => navigate('/login')} style={buttonStyle}>
            Back to Login
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Email address</label>
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Send Reset Link
          </button>
        </form>
      )}
    </div>
  );
};

const inputStyle = {
  width: '95%',
  padding: '10px',
  margin: '10px 0 20px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  width: '100%',
  background: 'black',
  color: 'white',
  padding: '12px',
  borderRadius: '4px',
  fontFamily: 'Poppins',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default ForgotPassword;
