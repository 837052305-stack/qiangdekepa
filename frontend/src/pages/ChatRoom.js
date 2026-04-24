import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [applyReason, setApplyReason] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const socketRef = useRef();
  const messagesEndRef = useRef();

  // 获取房间信息
  const fetchRoomInfo = async () => {
    try {
      const response = await api.get(`/api/chat-rooms/${id}`);
      setRoom(response.data.room);
      setMyRole(response.data.myRole);
    } catch (error) {
      console.error('获取房间信息失败:', error);
    }
  };

  // 获取历史消息
  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/chat-rooms/${id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('获取消息失败:', error);
    }
  };

  // 获取成员列表
  const fetchMembers = async () => {
    try {
      const response = await api.get(`/api/chat-rooms/${id}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('获取成员失败:', error);
    }
  };

  // 获取待审核列表
  const fetchPending = async () => {
    try {
      const response = await api.get(`/api/chat-rooms/${id}/pending`);
      setPendingMembers(response.data);
    } catch (error) {
      console.error('获取待审核列表失败:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchRoomInfo(), fetchMessages()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));

    // 连接 Socket.io
    const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl);

    // 加入房间
    if (user) {
      socketRef.current.emit('join_room', { roomId: id, user });
    }

    // 监听新消息
    socketRef.current.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 监听用户加入/离开
    socketRef.current.on('user_joined', (data) => {
      setMessages((prev) => [...prev, {
        type: 'system',
        content: data.message,
        createdAt: new Date()
      }]);
    });

    socketRef.current.on('user_left', (data) => {
      setMessages((prev) => [...prev, {
        type: 'system',
        content: data.message,
        createdAt: new Date()
      }]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id, user]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socketRef.current.emit('send_message', {
      roomId: id,
      content: newMessage,
      user
    });

    setNewMessage('');
  };

  const handleApplyJoin = async () => {
    setApplyLoading(true);
    try {
      const response = await api.post(`/api/chat-rooms/${id}/join`, {
        reason: applyReason
      });
      alert(response.data.message);
      setMyRole(response.data.status === 'joined' ? 'member' : 'pending');
    } catch (error) {
      alert(error.response?.data?.message || '申请失败');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleApprove = async (userId, action) => {
    try {
      await api.put(`/api/chat-rooms/${id}/members/${userId}`, { action });
      fetchPending();
      fetchMembers();
    } catch (error) {
      alert('操作失败');
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!room) {
    return <div className="error-message">聊天室不存在</div>;
  }

  // 未加入私密房间
  if (!myRole && !room.isPublic) {
    return (
      <div className="auth-container">
        <h2 className="auth-title">🔒 {room.name}</h2>
        <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>
          这是一个私密聊天室，需要申请加入
        </p>
        <div className="form-group">
          <textarea
            className="form-textarea"
            placeholder="介绍一下自己，说明为什么想加入..."
            value={applyReason}
            onChange={(e) => setApplyReason(e.target.value)}
            rows={3}
          />
        </div>
        <button
          className="btn btn-primary btn-block"
          onClick={handleApplyJoin}
          disabled={applyLoading}
        >
          {applyLoading ? '申请中...' : '申请加入'}
        </button>
      </div>
    );
  }

  // 待审核状态
  if (myRole === 'pending') {
    return (
      <div className="auth-container">
        <h2 className="auth-title">⏳ 等待审核</h2>
        <p style={{ textAlign: 'center', color: '#64748b' }}>
          您的加入申请已提交，请等待房主审核
        </p>
      </div>
    );
  }

  return (
    <div className="chat-room-container">
      {/* 房间头部 */}
      <div className="chat-room-header">
        <div className="chat-room-info">
          <img src={room.avatar} alt={room.name} className="room-avatar" />
          <div>
            <h2>{room.name}</h2>
            <p>{room.description}</p>
          </div>
        </div>
        <div className="chat-room-actions">
          {(myRole === 'owner' || myRole === 'admin') && (
            <button
              className="btn btn-sm"
              onClick={() => { fetchPending(); setShowPending(true); }}
            >
              审核 ({pendingMembers.length})
            </button>
          )}
          <button
            className="btn btn-sm"
            onClick={() => { fetchMembers(); setShowMembers(true); }}
          >
            成员 ({members.length})
          </button>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.type === 'system' ? 'system' : ''}`}
          >
            {msg.type === 'system' ? (
              <div className="system-message">{msg.content}</div>
            ) : (
              <>
                <img
                  src={msg.sender?.avatar}
                  alt={msg.sender?.username}
                  className="message-avatar"
                />
                <div className="message-content">
                  <div className="message-author">{msg.sender?.username}</div>
                  <div className="message-text">{msg.content}</div>
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="输入消息..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">发送</button>
      </form>

      {/* 成员列表弹窗 */}
      {showMembers && (
        <div className="modal" onClick={() => setShowMembers(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>成员列表</h3>
            {members.map((m) => (
              <div key={m._id} className="member-item">
                <img src={m.user?.avatar} alt={m.user?.username} />
                <span>{m.user?.username}</span>
                <span className="role">{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 审核弹窗 */}
      {showPending && (
        <div className="modal" onClick={() => setShowPending(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>待审核申请</h3>
            {pendingMembers.length === 0 ? (
              <p>暂无待审核申请</p>
            ) : (
              pendingMembers.map((m) => (
                <div key={m._id} className="pending-item">
                  <img src={m.user?.avatar} alt={m.user?.username} />
                  <div>
                    <div>{m.user?.username}</div>
                    <div className="reason">{m.applyReason}</div>
                  </div>
                  <div className="actions">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleApprove(m.user?._id, 'approve')}
                    >
                      同意
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleApprove(m.user?._id, 'reject')}
                    >
                      拒绝
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
