//sharan adhikari 24071844
import axios from 'axios';

// FIXED: Updated to use REACT_APP_API_URL environment variable first
const API_BASE = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://thompson-footwear-production.up.railway.app'
    : 'http://localhost:5000');

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${API_BASE}/api/users/login`, { email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Login failed';
  }
};

export const registerUser = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE}/api/users/signup`, formData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Signup failed';
  }
};