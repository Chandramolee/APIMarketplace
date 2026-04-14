import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Hash, ExternalLink, ArrowRight } from 'lucide-react';
import './ApiCard.css';
import { ensureAbsoluteUrl } from '../utils/urlHelper';

const ApiCard = ({ api }) => {
  return (
    <div className="api-card glass-panel animate-fade-in">
      <Link to={`/api/${api._id}`} className="api-card-link-wrapper" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
          <span 
            className="endpoint-clickable" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(ensureAbsoluteUrl(api.endpoint), '_blank', 'noopener,noreferrer');
            }}
            title="Click to open endpoint"
          >
            {api.endpoint.length > 35 ? api.endpoint.substring(0, 35) + '...' : api.endpoint}
          </span>
        </div>
      </Link>

      <div className="api-card-footer">
        {api.docsLink ? (
          <a href={ensureAbsoluteUrl(api.docsLink)} target="_blank" rel="noopener noreferrer" className="view-details" style={{ color: 'var(--accent-violet)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Visit Site <ExternalLink size={14} />
          </a>
        ) : (
          <span className="api-creator">By {api.creator?.name || 'Unknown'}</span>
        )}
        <Link to={`/api/${api._id}`} className="view-details">
          Compare <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ApiCard;
