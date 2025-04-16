// Login.js – Nike-style Login by Sharan Adhikari & reviewed by Thamasha Kodithuwakku 24351177

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Australia');
  const navigate = useNavigate();

  const handleContinue = () => {
    alert(`Email: ${email} - Country: ${country}`);
    // Future: redirect to OTP or password screen
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '80px auto',
      padding: '30px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      fontFamily: 'Poppins'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Enter your email to Sign In or Join Us</h2>

      <label>Email address</label>
      <input 
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{
          width: '100%',
          padding: '10px',
          fontFamily: 'Poppins',
          margin: '10px 0 20px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      <label>Country</label>
      <select 
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontFamily: 'Poppins',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      >
        <option>Australia</option>
        <option>United States</option>
        <option>India</option>
        <option>United Kingdom</option>
      </select>

      <p style={{ fontSize: '12px', marginBottom: '20px'  }}>
        By continuing, I agree to Thompson Footwear's <a href="#" style={{ color: '#555' }}>Privacy Policy</a> and 
        <a href="#" style={{ color: '#555' }}> Terms of Use</a>.
      </p>

      <button 
        onClick={handleContinue}
        style={{
          width: '100%',
          background: 'black',
          color: 'white',
          padding: '12px',
          borderRadius: '4px',
          fontFamily: 'Poppins',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Continue
      </button>

      {/* Sign Up Button for new users */}
      <button 
        onClick={() => navigate('/register')}
        style={{
          width: '100%',
          background: 'white',
          color: 'black',
          padding: '12px',
          fontFamily: 'Poppins',
          borderRadius: '4px',
          border: '1px solid black',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        New here? Sign Up
      </button>
    </div>
  );
};

export default Login;
