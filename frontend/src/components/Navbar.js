// Navbar.js – Updated by Sharan Adhikari

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { FaShoppingBag } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img
          src="/images/storelogo.png"
          alt="Thompson Footwear Logo"
          style={{
            position: 'relative',
            height: '150px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Link>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Shop</Link></li>

        <li>
          <Link to="/cart" className="cart-icon" style={{ position: 'relative' }}>
            <FaShoppingBag size={20} />
            {cartItems.length > 0 && (
              <span
                className="cart-count"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: 'red',
                  color: 'white',
                  fontSize: '12px',
                  padding: '2px 6px',
                  borderRadius: '50%',
                }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>
        </li>

        {user ? (
          <>
            <li><Link to="/account">My Account</Link></li>
            {user.is_admin === 1 && (
              <li><Link to="/admin">Admin</Link></li>
            )}
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
