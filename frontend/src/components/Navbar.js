// Navbar.js – Updated 

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { FaShoppingBag, FaSearch } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = () => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
      setSearchTerm('');
      setShowSearch(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

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
        <li className="search-toggle" style={{ display: 'flex', alignItems: 'center' }}>
          <FaSearch
            size={18}
            style={{ cursor: 'pointer', color: 'rgb(179, 170, 170)' }} 
            onClick={() => setShowSearch(!showSearch)}
          />
        </li>


        {showSearch && (
          <li className="search-box" style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search Men,Women or Kids..."
              style={{
                padding: '6px',
                borderRadius: '4px',
                fontFamily: 'Poppins',
                border: '1px solid #ccc',
                fontSize: '14px',
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                marginLeft: '5px',
                padding: '6px 10px',
                fontSize: '14px',
                cursor: 'pointer',
                 fontFamily: 'Poppins',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              Search
            </button>
          </li>
        )}

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
