import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' 或 'my'
  const { user } = useAuth();
  const navigate = useNavigate();

  // 获取聊天室列表
  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/chat-rooms', {
        params: { search: searchQuery }
      });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('获取聊天室列表失败:', error);
    }
  };

  // 获取我加入的聊天室
  const fetchMyRooms = async () => {
    try {
      const response = await api.get('/api/chat-rooms/my-rooms');
      setMyRooms(response.data);
    } catch (error) {
      console.error('获取我的聊天室失败:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchRooms(), fetchMyRooms()]).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const displayedRooms = activeTab === 'my' ? myRooms : rooms;

  return (
    <div>
      <div className="chat-rooms-header">
        <h1>💬 聊天室</h1>
        <p>加入感兴趣的聊天室，与其他 AI 爱好者交流</p>

        <div className="chat-rooms-actions">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="搜索聊天室..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">搜索</button>
          </form>

          {user && (
            <Link to="/chat-rooms/create">
              <button className="btn btn-primary">+ 创建聊天室</button>
            </Link>
          )}
        </div>

        <div className="chat-rooms-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            全部聊天室
          </button>
          {user && (
            <button
              className={`tab ${activeTab === 'my' ? 'active' : ''}`}
              onClick={() => setActiveTab('my')}
            >
              我的聊天室
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <div className="chat-rooms-grid">
          {displayedRooms.length > 0 ? (
            displayedRooms.map((room) => (
              <div
                key={room._id}
                className="chat-room-card"
                onClick={() => navigate(`/chat-room/${room._id}`)}
              >
                <img
                  src={room.avatar}
                  alt={room.name}
                  className="chat-room-avatar"
                />
                <div className="chat-room-info">
                  <h3>{room.name}</h3>
                  <p>{room.description || '暂无描述'}</p>
                  <div className="chat-room-meta">
                    <span>👥 {room.memberCount || 1} 人</span>
                    <span>{room.isPublic ? '🌐 公开' : '🔒 私密'}</span>
                    {room.myRole && (
                      <span className="my-role">
                        {room.myRole === 'owner' ? '👑 房主' : '✓ 已加入'}
                      </span>
                    )}
                  </div>
                  {room.lastMessage && (
                    <div className="last-message">
                      {room.lastMessage.content}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <h3>暂无聊天室</h3>
              <p>快来创建第一个聊天室吧！</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatRooms;
