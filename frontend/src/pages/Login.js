import React from 'react';
import { Link } from 'react-router-dom'; 
import './login.css';
import './HomePage.css';


const Login = () => {
  return (
   <div>
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit" className="login-button">Login</button>
      <p>Don't have an account? <Link to="/register">Sign up</Link></p>
    </div>
  );
};

export default Login;
