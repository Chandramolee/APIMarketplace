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
        
        {/* Left Side: Logo & Main Nav */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <Server size={24} className="logo-icon" />
            <span className="logo-text">openapi</span>
          </Link>

          <div className="nav-links">
            <div className="nav-item">About us <ChevronDown size={14}/></div>
            <div className="nav-item">Products <ChevronDown size={14}/></div>
            <div className="nav-item">Solutions <ChevronDown size={14}/></div>
            <Link to="/" className="nav-item">Pricing</Link>
            <div className="nav-item">Resources <ChevronDown size={14}/></div>
            <div className="nav-item">Developer <ChevronDown size={14}/></div>
            <div className="nav-item">Partner <ChevronDown size={14}/></div>
          </div>
        </div>

        {/* Right Side: Utils & Auth */}
        <div className="nav-right">
          <Search size={18} className="search-icon-nav" />
          <div className="nav-utils">
            <span className="lang-select">English <ChevronDown size={14}/></span>
            <span className="contact">Contact Us</span>
          </div>
          
          {user ? (
             <div className="user-menu">
               <span className="user-greeting">
                 <User size={18}/> 
                 <Link to="/dashboard" style={{color: 'inherit', textDecoration: 'none'}}>{user.name}</Link>
               </span>
               <button onClick={handleLogout} className="logout-btn"><LogOut size={18} /></button>
             </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth" className="login-link">LOGIN</Link>
              <Link to="/auth" className="signup-btn">SIGN UP</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
