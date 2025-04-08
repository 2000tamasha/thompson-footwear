import React from 'react';
import { Link } from 'react-router-dom'; 
import './css/register.css';


const Register = () => {
return(
<div className="register-container">
      <h2>Register</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email"/>
      </div>
    <div className="form-group">
        <label htmlFor="name">Name</label>
        <input type="name" id="name" name="name"/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit" className="register-button">Register</button>
      <p>Already have an account? <Link to="/login">Sign In</Link></p>
    </div>
  );

  };

export default Register;
