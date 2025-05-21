//sharan adhikari 24071844
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

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
