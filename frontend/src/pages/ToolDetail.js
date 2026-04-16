import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ToolDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchToolDetail();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchToolDetail = async () => {
    try {
      const response = await api.get(`/api/tools/${id}`);
      setTool(response.data);
      if (user && response.data.likes) {
        setIsLiked(response.data.likes.some(like => like._id === user.id));
      }
    } catch (error) {
      console.error('获取工具详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/api/comments/tool/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('获取评论失败:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/api/tools/${id}/like`);
      setIsLiked(response.data.liked);
      setTool(prev => ({
        ...prev,
        likesCount: response.data.likesCount
      }));
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await api.post(`/api/tools/${id}/favorite`);
      setIsFavorited(response.data.favorited);
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentContent.trim()) return;

    try {
      await api.post('/api/comments', {
        content: commentContent,
        toolId: id
      });
      setCommentContent('');
      fetchComments();
      fetchToolDetail();
    } catch (error) {
      console.error('发表评论失败:', error);
    }
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (!tool) return <div className="empty-state">工具不存在</div>;

  return (
    <div className="tool-detail">
      <div className="tool-detail-header">
        <h1 className="tool-detail-title">{tool.name}</h1>
        <div className="tool-detail-meta">
          <span className="tool-card-category">{tool.category}</span>
          <span>👁 {tool.views} 浏览</span>
          <span>❤️ {tool.likesCount} 喜欢</span>
          <span>💬 {tool.commentsCount} 评论</span>
        </div>
      </div>

      <div className="tool-detail-body">
        <p className="tool-detail-description">{tool.description}</p>

        {tool.tags && tool.tags.length > 0 && (
          <div className="tool-card-tags" style={{ marginBottom: '24px' }}>
            {tool.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="tool-detail-actions">
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            🚀 访问工具
          </a>
          <button
            onClick={handleLike}
            className={`btn ${isLiked ? 'btn-danger' : 'btn-secondary'}`}
          >
            {isLiked ? '❤️ 已喜欢' : '🤍 喜欢'}
          </button>
          <button
            onClick={handleFavorite}
            className={`btn ${isFavorited ? 'btn-primary' : 'btn-outline'}`}
          >
            {isFavorited ? '⭐ 已收藏' : '☆ 收藏'}
          </button>
        </div>

        <div className="tool-card-author" style={{ marginBottom: '24px' }}>
          <img
            src={tool.author?.avatar}
            alt={tool.author?.username}
            className="author-avatar"
          />
          <div>
            <div>分享者</div>
            <Link to={`/profile/${tool.author?._id}`} style={{ fontWeight: 600 }}>
              {tool.author?.username}
            </Link>
          </div>
        </div>

        {/* 评论区 */}
        <div className="comments-section">
          <h3 className="comments-title">💬 讨论区 ({tool.commentsCount})</h3>

          {user && (
            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                className="form-textarea"
                placeholder="分享你对这个工具的看法..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                rows={3}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '12px' }}
                disabled={!commentContent.trim()}
              >
                发表评论
              </button>
            </form>
          )}

          <div className="comment-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-author">
                      <img
                        src={comment.author?.avatar}
                        alt={comment.author?.username}
                        className="author-avatar"
                      />
                      <Link to={`/profile/${comment.author?._id}`}>
                        {comment.author?.username}
                      </Link>
                    </div>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>暂无评论，快来发表第一条评论吧！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;
