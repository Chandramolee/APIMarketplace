import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Hash, ArrowRight } from 'lucide-react';
import './ApiCard.css';

const ApiCard = ({ api }) => {
  return (
    <div className="api-card glass-panel animate-fade-in">
      <div className="api-card-header">
        <div>
          <h3 className="api-title">{api.name}</h3>
          <span style={{ fontSize: '0.85rem', color: '#eab308', fontWeight: '600' }}>
            ★ {api.avgRating > 0 ? api.avgRating.toFixed(1) : 'New'}
          </span>
        </div>
        <span className="api-category"><Hash size={14}/> {api.category}</span>
      </div>
      <p className="api-desc">{api.description.length > 100 ? api.description.substring(0, 100) + '...' : api.description}</p>
      
      <div className="api-endpoint">
        <Code size={16} />
        <span>{api.endpoint.length > 35 ? api.endpoint.substring(0, 35) + '...' : api.endpoint}</span>
      </div>

      <div className="api-card-footer">
        <span className="api-creator">By {api.creator?.name || 'Unknown'}</span>
        <Link to={`/api/${api._id}`} className="view-details">
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ApiCard;
