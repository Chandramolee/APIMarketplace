import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LoginRegister.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await register(name, email, password);
      
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
          Create an Account
        </h2>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
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
            Register
          </button>
        </form>

        <div className="auth-toggle">
          <span className="text-secondary">
            Already have an account? 
          </span>
          <Link to="/login" className="toggle-btn" style={{ textDecoration: 'none', marginLeft: '0.5rem' }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
