// Register.js – Sharan Adhikari

import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    updates: false,
    agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.agree) return alert("You must agree to our policy");
    // TODO: Validate password strength
    alert(`Welcome, ${form.name}!`);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: '500px',
      margin: '80px auto',
      padding: '30px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 0 20px rgba(0,0,0,0.1)',
      fontFamily: 'sans-serif'
    }}>
      <h2>Create your account</h2>

      <label>Name</label>
      <input name="name" required value={form.name} onChange={handleChange} style={inputStyle} />

      <label>Email</label>
      <input name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle} />

      <label>Password</label>
      <input
        name="password"
        type="password"
        required
        value={form.password}
        onChange={handleChange}
        placeholder="Min 8 characters, 1 uppercase, lowercase, number"
        style={inputStyle}
      />

      <label>Date of Birth</label>
      <input name="dob" type="date" required value={form.dob} onChange={handleChange} style={inputStyle} />

      <div style={{ margin: '15px 0' }}>
        <label>
          <input type="checkbox" name="updates" checked={form.updates} onChange={handleChange} />
          {' '}Get email updates from thompsonfootwear
        </label>
      </div>

      <div style={{ margin: '15px 0' }}>
        <label>
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} required />
          {' '}I agree to Thompson'sfoowear  Policy and Terms
        </label>
      </div>

      <button type="submit" style={{
        width: '100%',
        background: 'black',
        color: 'white',
        padding: '12px',
        borderRadius: '4px',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        Create Account
      </button>
    </form>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

export default Register;
