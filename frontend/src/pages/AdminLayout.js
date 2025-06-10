// AdminLayout.js – Final Fix with Back Button and Safe Check by Sharan Adhikari 24071844

import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.is_admin !== 1) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null; // Wait until user is available

  return (
    <div style={{ display: 'flex', fontFamily: 'Poppins' }}>
      <aside style={{
        width: '250px',
        height: '100vh',
        background: '#222',
        color: '#fff',
        padding: '80px 20px 20px',
        position: 'fixed',
        top: 0,
        left: 0
      }}>
        <h3 style={{ marginBottom: '30px' }}>Admin Panel</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/admin/dashboard" style={linkStyle}>📊 Dashboard</Link>
          <Link to="/admin/orders" style={linkStyle}>📦 Orders</Link>
          <Link to="/admin/products" style={linkStyle}>🛍 Products</Link>
          <Link to="/admin/users" style={linkStyle}>👥 Users</Link>
          <Link to="/admin/messages" style={linkStyle}>📩 Messages</Link>
          <Link to="/admin/reviews" style={linkStyle}>⭐ Reviews</Link>

          <hr />
          <Link to="/" style={linkStyle}>🔙 Back to Website</Link>
        </nav>
      </aside>
      <main style={{ 
  marginLeft: '260px', 
  padding: '40px', 
  flex: 1, 
  position: 'relative', 
  zIndex: 1 
}}>
  <Outlet />
</main>

    </div>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '16px'
};

export default AdminLayout;