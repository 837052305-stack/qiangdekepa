import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToolCard from '../components/ToolCard';
import api from '../services/api';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/api/tools/user/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('获取收藏失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>⭐ 我的收藏</h2>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : favorites.length > 0 ? (
        <div className="tools-grid">
          {favorites.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">⭐</div>
          <h3 className="empty-state-title">暂无收藏</h3>
          <p>浏览工具时点击收藏按钮，将喜欢的工具添加到这里</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
