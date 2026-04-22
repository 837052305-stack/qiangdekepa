import React from 'react';
import { Link } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  // 使用 microlink 自动生成网站截图
  const screenshotUrl = tool.image || `https://api.microlink.io/?url=${encodeURIComponent(tool.link)}&screenshot=true&embed=screenshot.url&meta=false`;

  return (
    <div className="tool-card">
      <div className="tool-card-image-wrapper">
        <img
          src={screenshotUrl}
          alt={tool.name}
          className="tool-card-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=AI+Tool';
          }}
        />
        <div className="tool-card-overlay"></div>
        <span className="tool-card-category-badge">{tool.category}</span>
      </div>
      <div className="tool-card-content">
        <div className="tool-card-header">
          <Link to={`/tool/${tool._id}`} className="tool-card-title">
            {tool.name}
          </Link>
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
            <span className="stat-item">❤️ {tool.likesCount || 0}</span>
            <span className="stat-item">💬 {tool.commentsCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
