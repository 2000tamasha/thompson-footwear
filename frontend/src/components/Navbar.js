// Navbar.js – Created by Sharan Adhikari 24071844 & Updated by Thamasha Kodithuwakku 24351177

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/cartContext'; //  import context

const Navbar = () => {
  const { cartItems } = useCart(); //  use real cart state

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/images/storelogo.png" alt="Thompson Footwear Logo" style={{
          position: 'relative',
          height: '150px',     // Adjust this to your preferred size
          width: 'auto',      // Maintains aspect ratio
          objectFit: 'contain'
        }} />
      </Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Shop</Link></li>
        <li>
          <Link to="/cart" className="cart-icon" style={{ position: 'relative' }}>
            <FaShoppingBag size={20} />
            {cartItems.length > 0 && ( //  Only show if items exist
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
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
