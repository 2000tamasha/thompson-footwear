/// AdminDashboard.js – Admin Overview by Sharan Adhikari 24071844

import React, { useEffect, useState } from 'react';

// API Base URL for both development and production
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://thompson-footwear-production.up.railway.app'
  : 'http://localhost:5000';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE}/api/orders`),
        fetch(`${API_BASE}/api/users`),
        fetch(`${API_BASE}/api/products`)
      ]);

      const orders = await ordersRes.json();
      const users = await usersRes.json();
      const products = await productsRes.json();

      const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
      const totalOrders = orders.length;
      const totalUsers = users.length;
      const totalProducts = products.length;

      setStats({ totalSales, totalOrders, totalUsers, totalProducts });
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  };

  return (
    <div>
      <h2>📊 Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '30px' }}>
        <div style={cardStyle}>
          <h3>Total Sales</h3>
          <p>${stats.totalSales.toFixed(2)}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div style={cardStyle}>
          <h3>Registered Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div style={cardStyle}>
          <h3>Available Products</h3>
          <p>{stats.totalProducts}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  flex: '1 1 200px',
  padding: '20px',
  background: '#f8f9fa',
  border: '1px solid #ccc',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  fontFamily: 'Poppins'
};

export default AdminDashboard;