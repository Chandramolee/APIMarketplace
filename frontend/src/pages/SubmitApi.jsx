import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const SubmitApi = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    endpoint: '',
    category: 'Development',
    exampleRequest: '',
    exampleResponse: '',
    tags: '',
    docsLink: ''
  });

  const categories = ['Weather', 'Finance', 'Development', 'Social', 'AI', 'Healthcare', 'E-Commerce', 'Sports', 'Travel', 'Media', 'Other'];

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      };
      const { data } = await axios.post('http://localhost:5005/api/apis', formData, config);
      toast.success('API submitted successfully! It is pending approval.');
      navigate(`/api/${data._id}`);
    } catch (error) {
      toast.error('Error submitting API. Please try again.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Publish a New API</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">API Name</label>
            <input type="text" className="form-input" required 
              value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" required 
              value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Endpoint URL</label>
              <input type="text" className="form-input" required 
                placeholder="https://api.example.com/v1"
                value={formData.endpoint} onChange={(e)=>setFormData({...formData, endpoint: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})}>
                {categories.map(c => <option value={c} key={c} style={{background: '#0f111a'}}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Docs Link (Optional)</label>
              <input type="text" className="form-input" placeholder="https://docs.example.com"
                value={formData.docsLink} onChange={(e)=>setFormData({...formData, docsLink: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input type="text" className="form-input" placeholder="data, weather, fast"
                value={formData.tags} onChange={(e)=>setFormData({...formData, tags: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Example Request</label>
            <textarea className="form-input" placeholder="GET /api/users"
              value={formData.exampleRequest} onChange={(e)=>setFormData({...formData, exampleRequest: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Example Response (JSON)</label>
            <textarea className="form-input" style={{fontFamily: 'monospace', minHeight: '150px'}}
              value={formData.exampleResponse} onChange={(e)=>setFormData({...formData, exampleResponse: e.target.value})} 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '1rem', padding: '1rem'}}>
            Publish API
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitApi;
