import React, { useState, useEffect } from 'react';
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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutFlow = new URLSearchParams(location.search).get('checkout') === '1';
  const [userName, setUserName] = useState('');

  // FIXED: Updated API_BASE_URL to use REACT_APP_API_URL first
  const API_BASE_URL = process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://thompson-footwear-production-d96f.up.railway.app'
      : 'http://localhost:5000');

  const safeLocalStorage = {
    setItem: (key, value) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value);
        }
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    },
    getItem: (key) => {
      try {
        if (typeof window !== 'undefined') {
          return localStorage.getItem(key);
        }
      } catch (error) {
        console.warn('Failed to read from localStorage:', error);
      }
      return null;
    }
  };

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setError('');
    
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      let data;
      try {
        data = await loginUser(email, password);
      } catch (serviceError) {
        // FIXED: Changed from /api/auth/login to /api/users/login
        const response = await fetch(`${API_BASE_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        }

        data = await response.json();
      }
      
      if (!data || !data.user && !data.token) {
        throw new Error('Invalid response from server');
      }

      const user = data.user || { email, name: data.name };
      const token = data.token;

      setUser(user);
      setUserName(user.name || user.email || email);
      
      if (token) {
        safeLocalStorage.setItem('token', token);
      }
      safeLocalStorage.setItem('user', JSON.stringify(user));

      // FIXED: Updated admin check to use is_admin field
      const isAdmin = user?.is_admin === 1 || user?.role === 'admin' || user?.email === 'admin@example.com';

      if (isAdmin) {
        navigate('/admin/dashboard');
      } else if (isCheckoutFlow) {
        navigate('/checkout');
      } else {
        setShowWelcome(true);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    navigate('/', { 
      state: { welcomeName: userName }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && agreeTerms && email && password) {
      handleLogin();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(e);
  };

  return (
    <div style={containerStyle}>
      {showWelcome && (
        <>
          <Confetti />
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h2>Hi {userName}!</h2>
              <p>🎉 Welcome to Thompson Footwear!</p>
              <button onClick={handleWelcomeClose} style={buttonStyle}>
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}

      {!showWelcome && (
        <form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '20px' }}>Enter your email to Sign In or Join Us</h2>

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <label>Email address</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="you@example.com"
            style={inputStyle}
            disabled={isLoading}
            required
          />

          <label>Country</label>
          <select 
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
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
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              style={{ ...inputStyle, paddingRight: '40px' }}
              disabled={isLoading}
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButton}
              disabled={isLoading}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#007bff' }}>
              Forgot password?
            </Link>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', fontSize: '14px', lineHeight: '1.4' }}>
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}
                disabled={isLoading}
              />
              <span>
                By continuing, I agree to Thompson Footwear's{" "}
                <Link to="/privacy-policy" style={{ color: '#555', textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link to="/terms-of-use" style={{ color: '#555', textDecoration: 'underline' }}>
                  Terms of Use
                </Link>.
              </span>
            </label>
          </div>

          <button 
            type="submit"
            disabled={!agreeTerms || !email || !password || isLoading}
            style={{
              ...primaryBtnStyle,
              opacity: (agreeTerms && email && password && !isLoading) ? 1 : 0.5,
              cursor: (agreeTerms && email && password && !isLoading) ? 'pointer' : 'not-allowed'
            }}
          >
            {isLoading ? 'Signing in...' : 'Continue'}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/register')}
            style={secondaryBtnStyle}
            disabled={isLoading}
          >
            New here? Sign Up
          </button>
        </form>
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
  marginBottom: '20px',
  transition: 'opacity 0.2s'
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

const errorStyle = {
  background: '#fee',
  color: '#c33',
  padding: '10px',
  borderRadius: '4px',
  marginBottom: '20px',
  border: '1px solid #fcc',
  fontSize: '14px'
};

export default Login;