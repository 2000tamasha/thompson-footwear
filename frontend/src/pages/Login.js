import React from 'react';

const Login = () => {
  return (
    <div>
      <h2>Login Page</h2>
    <div className="form-group">
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
          </div>
    </div>
   <button type="submit" className="login-button">Login</button>
       
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;
