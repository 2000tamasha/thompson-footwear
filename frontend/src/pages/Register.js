import React from 'react';
import { Link } from 'react-router-dom'; 


const Register = () => {
return(
<div className="">
      <h2>Register</h2>
      <div className="">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" />
      </div>
      <div className="">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" />
      </div>
      <button type="submit" className="">Sign Up</button>
      <p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );



  };

export default Register;
