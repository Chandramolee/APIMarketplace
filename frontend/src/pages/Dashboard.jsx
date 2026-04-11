import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Key, Bookmark, MessageSquare, Trash2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Request Data
  const mockUsageData = [
    { name: 'Mon', requests: Math.floor(Math.random() * 5000) },
    { name: 'Tue', requests: Math.floor(Math.random() * 5000) },
    { name: 'Wed', requests: Math.floor(Math.random() * 5000) },
    { name: 'Thu', requests: Math.floor(Math.random() * 5000) },
    { name: 'Fri', requests: Math.floor(Math.random() * 5000) },
    { name: 'Sat', requests: Math.floor(Math.random() * 5000) },
    { name: 'Sun', requests: Math.floor(Math.random() * 5000) },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5005/api/users/dashboard', config);
        setStats(data.data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error(error);
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, navigate]);

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5005/api/users/key/${keyId}`, config);
      toast.success('Key revoked successfully');
      setStats({
        ...stats,
        keys: stats.keys.map(k => k._id === keyId ? { ...k, isActive: false } : k)
      });
    } catch (error) {
      toast.error('Failed to revoke key');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (loading) return <div className="container" style={{padding: '4rem', textAlign: 'center'}}>Loading dashboard...</div>;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="dashboard-header glass-panel">
        <h1 className="text-gradient">Welcome back, {user.name}</h1>
        <p style={{color: 'var(--text-secondary)'}}>Here is your API management center and resource overview.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dash-card glass-panel" style={{gridColumn: '1 / -1'}}>
          <h2>Weekly API Usage (Mock)</h2>
          <div style={{ height: '300px', width: '100%', marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'white'}} />
                <Line type="monotone" dataKey="requests" stroke="var(--accent-violet)" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dash-card glass-panel">
          <h2><Key size={20} style={{verticalAlign: 'bottom', marginRight: '0.5rem'}}/> Subscribed API Keys</h2>
          {stats.keys && stats.keys.length > 0 ? (
            <div className="item-list">
              {stats.keys.map(k => (
                <div key={k._id} className="dash-list-item">
                  <div>
                    <strong>{k.api?.name || 'Unknown API'}</strong>
                    <div style={{fontSize: '0.8rem', color: k.isActive ? '#10b981' : '#ef4444'}}>
                      {k.isActive ? 'Active' : 'Revoked'}
                    </div>
                  </div>
                  {k.isActive && (
                    <div className="key-actions">
                       <button onClick={() => copyToClipboard(k.key)} className="btn-small bg-blue">Copy</button>
                       <button onClick={() => handleRevokeKey(k._id)} className="btn-small bg-red"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">You haven't generated any API keys.</p>
          )}
        </div>

        <div className="dash-card glass-panel">
          <h2><Bookmark size={20} style={{verticalAlign: 'bottom', marginRight: '0.5rem'}}/> Bookmarked APIs</h2>
          {stats.bookmarks && stats.bookmarks.length > 0 ? (
            <div className="item-list">
              {stats.bookmarks.map(api => (
                <div key={api._id} className="dash-list-item">
                  <Link to={`/api/${api._id}`} style={{fontWeight: '600'}}>{api.name}</Link>
                  <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{api.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No bookmarked APIs yet.</p>
          )}
        </div>

        <div className="dash-card glass-panel">
          <h2><MessageSquare size={20} style={{verticalAlign: 'bottom', marginRight: '0.5rem'}}/> Your Reviews</h2>
          {stats.reviews && stats.reviews.length > 0 ? (
            <div className="item-list">
              {stats.reviews.map(rev => (
                <div key={rev._id} className="dash-list-item" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Link to={`/api/${rev.api?._id}`} style={{fontWeight: '600'}}>{rev.api?.name}</Link>
                    <span style={{color: '#eab308'}}>★ {rev.rating}</span>
                  </div>
                  <p style={{fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-secondary)'}}>{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">You haven't left any reviews.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
