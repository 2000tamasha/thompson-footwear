// App.js haran Adhikari 24071844

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';       // Landing page
import Home from './pages/Home';               // Product listing
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';             //  Now active
import Register from './pages/Register';
import Success from './pages/Success';
// import Checkout from './pages/Checkout';
// import Register from './pages/Register';
// import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} /> {/*  Login route */}
          <Route path="/register" element={<Register />} /> 
          <Route path="/success" element={<Success />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
