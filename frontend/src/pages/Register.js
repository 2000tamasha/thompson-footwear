// Register.js – with Welcome Confetti Modal by Sharan Adhikari

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import Confetti from 'react-confetti';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError("Please fill in all required fields.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (!form.agreeTerms) {
      return setError("You must agree to the terms.");
    }

    const newUser = {
      name: form.name,
      email: form.email,
      password: form.password,
      contact: form.contact,
      address: form.address,
      dob: form.dob,
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setShowWelcome(true); // 🎉 Show welcome modal instead of alert
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
              <h2>Hi {form.name},</h2>
              <p>🎉 Welcome to the Thompson Store!</p>
              <button onClick={handleWelcomeClose} style={buttonStyle}>
                Let’s Go to Store
              </button>
            </div>
          </div>
        </>
      )}

      {!showWelcome && (
        <>
          <h2 style={{ marginBottom: '20px' }}>Create an Account</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />

            <label>Email Address *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} />

            <label>Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ ...inputStyle, paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={eyeButton}
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
                required
                style={{ ...inputStyle, paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={eyeButton}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <label>Contact Number</label>
            <input name="contact" value={form.contact} onChange={handleChange} style={inputStyle} />

            <label>Address</label>
            <input name="address" value={form.address} onChange={handleChange} style={inputStyle} />

            <label>Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} style={inputStyle} />

            <label style={{ fontSize: '13px' }}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
                style={{ marginRight: '10px' }}
              />
              I agree to Thompson Footwear's <a href="#" style={{ color: '#555' }}>Privacy Policy</a> and 
              <a href="#" style={{ color: '#555' }}> Terms of Use</a>.
            </label>

            <button type="submit" style={submitStyle}>Register</button>
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
  border: '1px solid #ccc'
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
  marginTop: '20px'
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

export default Register;
