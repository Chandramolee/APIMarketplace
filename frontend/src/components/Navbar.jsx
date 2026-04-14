import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Server, LogOut, ChevronDown, User, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-openapi">
      <div className="container nav-container">
        
        <div className="nav-left">
          <Link to="/" className="nav-logo" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-violet)' }}>
            <span className="logo-text">API Hub</span>
          </Link>

          <div className="nav-links" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {/* Removed unused tabs */}
          </div>
        </div>

        {/* Right Side: Auth */}
        <div className="nav-right">
          
           {user ? (
             <div className="user-menu" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
               <span className="user-greeting">
                 <Link to="/dashboard" style={{color: 'var(--accent-violet)', textDecoration: 'none'}}>Dashboard [{user.name}]</Link>
               </span>
               <button onClick={handleLogout} className="logout-btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>Logout</button>
             </div>
          ) : (
            <div className="auth-buttons" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <Link to="/login" className="login-link">Login</Link>
              <Link to="/signup" className="btn-violet" style={{ textDecoration: 'none' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
