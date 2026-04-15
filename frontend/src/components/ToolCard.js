import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  return (
    <div className="tool-card">
      <img
        src={tool.image || 'https://via.placeholder.com/400x200?text=AI+Tool'}
        alt={tool.name}
        className="tool-card-image"
      />
      <div className="tool-card-content">
        <div className="tool-card-header">
          <Link to={`/tool/${tool._id}`} className="tool-card-title">
            {tool.name}
          </Link>
          <span className="tool-card-category">{tool.category}</span>
        </div>

        <p className="tool-card-description">{tool.description}</p>

        {tool.tags && tool.tags.length > 0 && (
          <div className="tool-card-tags">
            {tool.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="tool-card-footer">
          <div className="tool-card-author">
            <img
              src={tool.author?.avatar}
              alt={tool.author?.username}
              className="author-avatar"
            />
            <Link to={`/profile/${tool.author?._id}`} className="author-name">
              {tool.author?.username}
            </Link>
          </div>
          <div className="tool-card-stats">
            <span className="stat-item">❤️ {tool.likesCount}</span>
            <span className="stat-item">💬 {tool.commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
