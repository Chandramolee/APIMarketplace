import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Search, ArrowRight, CheckCircle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ApiCard from '../components/ApiCard';
import './Home.css';

const Home = () => {
  const [apis, setApis] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [category, setCategory] = useState('All');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalApis, setTotalApis] = useState(0);
  const { user } = useContext(AuthContext);

  const categories = ['All', 'Weather', 'Finance', 'Development', 'Social', 'AI', 'Healthcare', 'E-Commerce', 'Sports', 'Travel', 'Media'];

    const fetchApis = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:5005/api/apis?keyword=${debouncedKeyword}&category=${category}&rating=${rating}&sort=${sort}`;
      const { data } = await axios.get(url);
      setApis(data);
    } catch (error) {
      console.error('Error fetching APIs', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
    fetchApis();
  }, [debouncedKeyword, category, rating, sort]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5005/api/apis/stats');
        setTotalApis(data.totalApis);
      } catch (error) {
        console.error('Error fetching stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              Discover, Compare & <br/> Integrate the Best APIs
            </h1>
            <p className="hero-subtitle">
              Accelerate Digital Transformation, Simplify Processes, <br className="d-none d-lg-block" /> 
              and Lead Your Industry with Our APIs
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <h3 className="stat-value">{totalApis}</h3>
                <p className="stat-label">API Services Available</p>
              </div>
            </div>

            {!user && (
              <div className="hero-cta">
                <button className="btn-violet text-uppercase">
                  Sign Up <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="value-prop-section">
        <div className="container">
          <div className="vp-grid">
            <div className="vp-left">
              <h2 className="vp-title">API Made Simple</h2>
              <p className="vp-desc">Simplify and accelerate integration processes, optimize development costs without compromising on security, reliability, and service continuity!</p>
              {!user && <button className="btn-violet text-uppercase">Sign Up <ArrowRight size={18} /></button>}
            </div>
            <div className="vp-right">
              <div className="vp-feature">
                <div className="vp-icon"><CheckCircle size={24} /></div>
                <div>
                  <h4 className="vp-f-title">About US</h4>
                  <p className="vp-f-desc">We help companies accelerate digital transformation processes and reach their full potential through API integrations</p>
                </div>
              </div>
              <div className="vp-feature">
                <div className="vp-icon"><CheckCircle size={24} /></div>
                <div>
                  <h4 className="vp-f-title">What we do</h4>
                  <p className="vp-f-desc">We connect your Business to hundreds of web services and high-quality data, with transparent prices, free of annual fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search API Section */}
      <section className="search-api-section">
        <div className="container">
          <div className="search-header text-center">
            <h2 className="section-title">EXPLORE & COMPARE APIs</h2>
            <p className="section-subtitle">Find the best API for your business by comparing ratings and documentation</p>
          </div>

            <div className="search-field">
              <Search className="search-icon-input" size={20} />
              <input 
                type="text" 
                placeholder="Search APIs..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ borderRadius: '12px' }}
              />
            </div>

          <div className="category-filters">
            {categories.map(c => (
              <button 
                key={c} 
                className={`filter-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c === 'All' ? 'All Categories' : c}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <select aria-label="Sort APIs" className="filter-select" value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="" style={{background: '#0f111a'}}>Sort By: Newest</option>
              <option value="top_rated" style={{background: '#0f111a'}}>Sort By: Top Rated</option>
              <option value="most_reviewed" style={{background: '#0f111a'}}>Sort By: Most Reviewed</option>
            </select>
            
            <select aria-label="Filter Rating" className="filter-select" value={rating} onChange={e=>setRating(e.target.value)}>
              <option value="" style={{background: '#0f111a'}}>All Ratings</option>
              <option value="4" style={{background: '#0f111a'}}>4+ Stars</option>
              <option value="3" style={{background: '#0f111a'}}>3+ Stars</option>
            </select>
          </div>

          {loading ? (
            <div className="loader">Loading APIs...</div>
          ) : (
            <div className="api-grid">
              {apis.length === 0 ? (
                <div className="no-results">No APIs found matching your criteria.</div>
              ) : (
                apis.map(api => (
                  <ApiCard key={api._id} api={api} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
