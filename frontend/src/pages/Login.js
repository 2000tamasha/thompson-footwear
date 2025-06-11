// Login.js – Final version with conditional redirects by Sharan Adhikari

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { loginUser } from '../services/authService';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Australia');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutFlow = new URLSearchParams(location.search).get('checkout') === '1';
  const [userName, setUserName] = useState('');

  const handleLogin = async () => {
    if (!email || !password || !agreeTerms) {
      alert("Please fill in all fields and agree to terms.");
      return;
    }

    try {
      const data = await loginUser(email, password);
      setUser(data.user);
      setUserName(data.user.name);
      localStorage.setItem('user', JSON.stringify(data.user));

      const isAdmin = data.user?.role === 'admin' || data.user?.email === 'admin@example.com';

      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (isCheckoutFlow) {
        navigate('/checkout');
      } else {
        setShowWelcome(true);
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    navigate('/');
  };

  return (
    <div style={containerStyle}>
      {showWelcome && (
        <>
          <Confetti />
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h2>Hi {userName},</h2>
              <p>🎉 Welcome to the Thompson Store!</p>
              <button onClick={handleWelcomeClose} style={buttonStyle}>
                OK
              </button>
            </div>
          </div>
        </>
      )}

      {!showWelcome && (
        <>
          <h2 style={{ marginBottom: '20px' }}>Enter your email to Sign In or Join Us</h2>

          <label>Email address</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle}
          />

          <label>Country</label>
          <select 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={inputStyle}
          >
            <option>Australia</option>
            <option>United States</option>
            <option>India</option>
            <option>United Kingdom</option>
          </select>

          <label>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ ...inputStyle, paddingRight: '40px' }}
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButton}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            <a href="/forgot-password" style={{ fontSize: '13px', color: '#007bff' }}>
              Forgot password?
            </a>
          </div>

          <div className="form-check mb-3">
  <input type="checkbox" className="form-check-input" id="agree" required />
  <label className="form-check-label" htmlFor="agree">
    By continuing, I agree to Thompson Footwear's{" "}
    <Link to="/privacy-policy" style={{ color: '#555', textDecoration: 'underline' }}>
      Privacy Policy
    </Link>{" "}
    and{" "}
    <Link to="/terms-of-use" style={{ color: '#555', textDecoration: 'underline' }}>
      Terms of Use
    </Link>.
  </label>
</div>

          <button 
            onClick={handleLogin}
            disabled={!agreeTerms}
            style={{
              ...primaryBtnStyle,
              opacity: agreeTerms ? 1 : 0.5,
              cursor: agreeTerms ? 'pointer' : 'not-allowed'
            }}
          >
            Continue
          </button>

          <button 
            onClick={() => navigate('/register')}
            style={secondaryBtnStyle}
          >
            New here? Sign Up
          </button>
        </>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '400px',
  margin: '80px auto',
  marginTop: '150px',
  padding: '30px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  fontFamily: 'Poppins'
};

const inputStyle = {
  width: '95%',
  padding: '10px',
  fontFamily: 'Poppins',
  margin: '10px 0 20px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const primaryBtnStyle = {
  width: '100%',
  background: 'black',
  color: 'white',
  padding: '12px',
  borderRadius: '4px',
  fontFamily: 'Poppins',
  border: 'none',
  fontWeight: 'bold',
  marginBottom: '20px'
};

const secondaryBtnStyle = {
  width: '100%',
  background: 'white',
  color: 'black',
  padding: '12px',
  fontFamily: 'Poppins',
  borderRadius: '4px',
  border: '1px solid black',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const eyeButton = {
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '14px'
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const modalContent = {
  background: '#fff',
  padding: '40px',
  borderRadius: '12px',
  textAlign: 'center',
  fontFamily: 'Poppins',
  boxShadow: '0 0 25px rgba(0,0,0,0.2)'
};

const buttonStyle = {
  marginTop: '20px',
  padding: '10px 25px',
  fontSize: '16px',
  fontWeight: 'bold',
  borderRadius: '6px',
  border: 'none',
  background: '#2a9d8f',
  color: '#fff',
  cursor: 'pointer'
};

export default Login;
