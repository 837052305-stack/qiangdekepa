import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span>🚀</span>
          <span>强的可怕</span>
        </Link>

        <div className="navbar-links">
          <Link to="/hot" className="nav-link" style={{
            background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 700
          }}>
            🔥 高频使用
          </Link>
          <Link to="/" className="nav-link">首页</Link>
          <Link to="/featured" className="nav-link" style={{ color: '#9b59b6', fontWeight: 600 }}>⭐ 最佳推荐</Link>
          <Link to="/share" className="nav-link">分享工具</Link>
          <Link to="/chat" className="nav-link">聊天室</Link>
          <Link to="/favorites" className="nav-link">我的收藏</Link>

          {user && !user.isGuest ? (
            <div className="user-menu">
              <Link to={`/profile/${user.id}`}>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="user-avatar"
                />
              </Link>
              <button onClick={handleLogout} className="nav-btn">
                退出
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">登录</Link>
              <Link to="/register">
                <button className="nav-btn">注册</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
