// App.js – Final Fix by Sharan Adhikari 24071844

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Success from './pages/Success';
import ForgotPassword from './pages/ForgotPassword';
import Account from './pages/Account';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMessages from './pages/admin/AdminMessages';
import SignedInCheckout from './pages/SignedInCheckout';
import './App.css';

import { AuthProvider } from './context/authContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/success" element={<Success />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account" element={<Account />} />
              <Route path="/checkout" element={<SignedInCheckout />} /> 

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="messages" element={<AdminMessages />} />
              </Route>
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
