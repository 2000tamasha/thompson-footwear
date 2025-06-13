// Register.js – with Welcome Confetti Modal by Sharan Adhikari

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { registerUser } from '../services/authService';
import Confetti from 'react-confetti';
import { Link } from 'react-router-dom';

const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    address: '',
    dob: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // FIXED: Added API URL configuration
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("Please fill in all required fields.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (!form.agreeTerms) {
      return setError("You must agree to the terms and conditions.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError("Please enter a valid email address.");
    }

    setIsLoading(true);

    try {
      // FIXED: Use authService to register user with backend
      let data;
      try {
        data = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password
        });
      } catch (serviceError) {
        // Fallback to direct API call
        const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        }

        data = await response.json();
      }

      // Store user data
      const user = data.user || { 
        name: form.name, 
        email: form.email, 
        is_admin: 0 
      };

      setUser(user);
      safeLocalStorage.setItem('user', JSON.stringify(user));

      console.log('✅ User registered successfully:', user);
      setShowWelcome(true); // 🎉 Show welcome modal

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    navigate('/', { 
      state: { welcomeName: form.name }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && form.agreeTerms && form.name && form.email && form.password && form.confirmPassword) {
      handleSubmit(e);
    }
  };

  return (
    <div style={containerStyle}>
      {showWelcome && (
        <>
          <Confetti />
          <div style={modalOverlay}>
            <div style={modalContent}>
              <h2>Hi {form.name},</h2>
              <p>🎉 Welcome to the Thompson Store!</p>
              <button onClick={handleWelcomeClose} style={buttonStyle}>
                Let's Go to Store
              </button>
            </div>
          </div>
        </>
      )}

      {!showWelcome && (
        <>
          <h2 style={{ marginBottom: '20px' }}>Create an Account</h2>
          
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>Full Name *</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              onKeyPress={handleKeyPress}
              required 
              style={inputStyle}
              disabled={isLoading}
              placeholder="Enter your full name"
            />

            <label>Email Address *</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              onKeyPress={handleKeyPress}
              required 
              style={inputStyle}
              disabled={isLoading}
              placeholder="you@example.com"
            />

            <label>Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                required
                style={{ ...inputStyle, paddingRight: '40px' }}
                disabled={isLoading}
                placeholder="At least 6 characters"
                minLength="6"
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

            <label>Confirm Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                required
                style={{ ...inputStyle, paddingRight: '40px' }}
                disabled={isLoading}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={eyeButton}
                disabled={isLoading}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <label>Contact Number</label>
            <input 
              name="contact" 
              value={form.contact} 
              onChange={handleChange} 
              style={inputStyle}
              disabled={isLoading}
              placeholder="Optional"
            />

            <label>Address</label>
            <input 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              style={inputStyle}
              disabled={isLoading}
              placeholder="Optional"
            />

            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={form.dob} 
              onChange={handleChange} 
              style={inputStyle}
              disabled={isLoading}
            />

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', fontSize: '14px', lineHeight: '1.4' }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  style={{ marginRight: '8px', marginTop: '2px', flexShrink: 0 }}
                  disabled={isLoading}
                />
                <span>
                  I agree to Thompson Footwear's{" "}
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
              disabled={!form.agreeTerms || !form.name || !form.email || !form.password || !form.confirmPassword || isLoading}
              style={{
                ...submitStyle,
                opacity: (form.agreeTerms && form.name && form.email && form.password && form.confirmPassword && !isLoading) ? 1 : 0.5,
                cursor: (form.agreeTerms && form.name && form.email && form.password && form.confirmPassword && !isLoading) ? 'pointer' : 'not-allowed'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '450px',
  margin: '120px auto',
  padding: '30px',
  background: '#fff',
  borderRadius: '8px',
  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  fontFamily: 'Poppins'
};

const inputStyle = {
  width: '95%',
  padding: '10px',
  margin: '10px 0 20px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontFamily: 'Poppins'
};

const submitStyle = {
  width: '100%',
  background: 'black',
  color: 'white',
  padding: '12px',
  borderRadius: '4px',
  fontFamily: 'Poppins',
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '20px',
  transition: 'opacity 0.2s'
};

const eyeButton = {
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#007bff'
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

export default Register;