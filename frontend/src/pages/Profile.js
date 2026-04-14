import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToolCard from '../components/ToolCard';
import api from '../services/api';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/api/users/${id}`);
      setUser(response.data.user);
      setTools(response.data.tools);

      // 检查是否已关注
      if (currentUser && response.data.user.followers) {
        setIsFollowing(
          response.data.user.followers.some(
            follower => follower._id === currentUser.id
          )
        );
      }
    } catch (error) {
      console.error('获取用户资料失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      alert('请先登录');
      return;
    }
    try {
      const response = await api.post(`/api/users/${id}/follow`);
      setIsFollowing(response.data.following);
      fetchUserProfile();
    } catch (error) {
      console.error('关注操作失败:', error);
    }
  };

  const isOwnProfile = currentUser?.id === id;

  if (loading) return <div className="loading">加载中...</div>;
  if (!user) return <div className="empty-state">用户不存在</div>;

  return (
    <div>
      <div className="profile-header">
        <img
          src={user.avatar}
          alt={user.username}
          className="profile-avatar"
        />
        <h1 className="profile-name">{user.username}</h1>
        {user.bio && <p className="profile-bio">{user.bio}</p>}

        <div className="profile-stats">
          <div className="stat">
            <div className="stat-value">{tools.length}</div>
            <div className="stat-label">分享工具</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user.following?.length || 0}</div>
            <div className="stat-label">关注</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user.followers?.length || 0}</div>
            <div className="stat-label">粉丝</div>
          </div>
        </div>

        {!isOwnProfile && currentUser && (
          <button
            onClick={handleFollow}
            className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isFollowing ? '已关注' : '+ 关注'}
          </button>
        )}
      </div>

      <h2 style={{ marginBottom: '20px' }}>分享的工具</h2>

      {tools.length > 0 ? (
        <div className="tools-grid">
          {tools.map((tool) => (
            <ToolCard key={tool._id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">暂无分享</h3>
          <p>该用户还没有分享任何工具</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
