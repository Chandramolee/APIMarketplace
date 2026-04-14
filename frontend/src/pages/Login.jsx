import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginRegister.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
      
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page container animate-fade-in">
      <div className="auth-box glass-panel">
        <h2 className="auth-title" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Welcome Back
        </h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit btn-violet" style={{ fontFamily: "'JetBrains Mono', monospace", border: 'none' }}>
            Sign In
          </button>
        </form>

        <div className="auth-toggle">
          <span className="text-secondary">
            Don't have an account? 
          </span>
          <Link to="/signup" className="toggle-btn" style={{ textDecoration: 'none', marginLeft: '0.5rem' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
