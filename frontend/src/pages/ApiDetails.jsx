import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Server, User, Star, MessageSquare, Bookmark, Key, ExternalLink, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import './ApiDetails.css';
import { ensureAbsoluteUrl } from '../utils/urlHelper';

const ApiDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [api, setApi] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const { data: apiData } = await axios.get(`http://localhost:5005/api/apis/${id}`);
        setApi(apiData);
        
        const { data: reviewsData } = await axios.get(`http://localhost:5005/api/reviews/api/${id}`);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching API details', error);
      }
      setLoading(false);
    };
    fetchApiDetails();
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review');

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`http://localhost:5005/api/reviews`, {
        apiId: id,
        rating,
        comment
      }, config);
      
      setReviews([data, ...reviews]);
      setComment('');
      setRating(5);
    } catch (error) {
      alert('Error submitting review');
    }
  };

  const handleBookmark = async () => {
    if (!user) return toast.error('Please log in to bookmark APIs');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5005/api/users/bookmark/${id}`, {}, config);
      toast.success('Bookmark updated! Check your dashboard.');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleSubscribe = async () => {
    if (!user) return toast.error('Please log in to subscribe to APIs');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`http://localhost:5005/api/users/key/${id}`, {}, config);
      toast.success(`Subscribed successfully! Your key is ready in the dashboard.`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate key. You might already be subscribed.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(api.endpoint);
    setCopied(true);
    toast.success('Endpoint copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Loading...</div>;
  if (!api) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>API not found.</div>;

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="api-hero glass-panel">
        <div className="hero-top">
          <div>
            <h1 className="api-title-main text-gradient" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              {api.name}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              {api.docsLink && (
                 <a href={ensureAbsoluteUrl(api.docsLink)} target="_blank" rel="noreferrer" className="btn-violet" style={{display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 2rem', background: 'var(--accent-violet)', color: 'white', border: 'none', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace", borderRadius: '0'}}>
                   Visit Official Website <ExternalLink size={18} />
                 </a>
              )}
              <button onClick={handleSubscribe} className="btn-secondary" style={{padding: '0.5rem 1.5rem', fontFamily: "'JetBrains Mono', monospace", background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--glass-border)'}}>
                Get API Key
              </button>
              <button onClick={handleBookmark} className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', fontFamily: "'JetBrains Mono', monospace"}}>
                Bookmark
              </button>
            </div>
          </div>
          <div className="api-rating-badge">
            <Star fill="#eab308" color="#eab308" size={18} /> {api.avgRating > 0 ? Number(api.avgRating).toFixed(1) : avgRating}
          </div>
        </div>
        
        <p className="api-description-main">{api.description}</p>
        
        <div className="api-meta">
          <span className="meta-tag"><Server size={14}/> {api.category}</span>
          <span className="meta-tag"><User size={14}/> {api.creator?.name || 'Unknown User'}</span>
        </div>
      </div>

      <div className="api-content-grid">
        <div className="api-docs glass-panel">
          <h2>Documentation</h2>
          
          <div className="doc-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Endpoint URL</h3>
              <button 
                onClick={copyToClipboard}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid var(--glass-border)', 
                  color: 'var(--text-secondary)',
                  padding: '0.4rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontFamily: "'JetBrains Mono', monospace"
                }}
              >
                {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="code-block" style={{ borderLeft: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <a 
                href={ensureAbsoluteUrl(api.endpoint)} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}
              >
                {api.endpoint}
                <ExternalLink size={14} style={{ opacity: 0.6 }} />
              </a>
            </div>
          </div>

          <div className="doc-section">
            <h3>Example Request</h3>
            <pre className="code-block block-pre">{api.exampleRequest || 'GET /api/example'}</pre>
          </div>

          <div className="doc-section">
            <h3>Example Response</h3>
            <pre className="code-block block-pre">{api.exampleResponse || '{\n  "status": "success"\n}'}</pre>
          </div>
        </div>

        <div className="api-reviews-container glass-panel">
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace" }}>Community Reviews</h2>
          
          {user ? (
            <form onSubmit={submitReview} className="review-form">
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select className="form-input" value={rating} onChange={e=>setRating(e.target.value)}>
                  {[5,4,3,2,1].map(num => <option style={{background: '#0f111a'}} key={num} value={num}>{num} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Comment</label>
                <textarea className="form-input" style={{minHeight: '80px'}} value={comment} onChange={e=>setComment(e.target.value)} required />
              </div>
              <button className="btn btn-primary btn-violet" type="submit" style={{ fontFamily: "'JetBrains Mono', monospace", border: 'none' }}>Submit Review</button>
            </form>
          ) : (
            <div className="login-prompt">Please <a href="/auth" style={{color: 'var(--accent-primary)', textDecoration: 'underline'}}>log in</a> to leave a review.</div>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p style={{color: 'var(--text-secondary)'}}>No reviews yet. Be the first!</p>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <strong>{review.user?.name}</strong>
                    <span className="stars">
                      {Array.from({length: review.rating}).map((_, i) => <Star key={i} fill="#eab308" color="#eab308" size={14} />)}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDetails;
