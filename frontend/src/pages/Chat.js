import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // 连接Socket.io
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    // 加入聊天室
    newSocket.emit('join_chat', {
      id: user.id,
      username: user.username,
      avatar: user.avatar
    });

    // 监听消息
    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // 监听在线用户
    newSocket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    // 获取历史消息
    fetch('/api/chat/history', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error('获取历史消息失败:', err));

    return () => {
      newSocket.close();
    };
  }, [user, navigate]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit('send_message', {
      text: inputMessage,
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }
    });

    setInputMessage('');
  };

  if (!user) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h2>💬 实时聊天室</h2>
          <div className="chat-online-count">
            🟢 {onlineUsers.length} 人在线
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          欢迎，{user.username}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3 className="empty-state-title">还没有消息</h3>
            <p>发送第一条消息开始交流吧！</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.type === 'system'
                  ? 'system'
                  : message.user?.id === user.id
                  ? 'own'
                  : ''
              }`}
            >
              {message.type !== 'system' && (
                <div className="message-author">
                  <img
                    src={message.user?.avatar}
                    alt={message.user?.username}
                    className="message-avatar"
                  />
                  <span>{message.user?.username}</span>
                </div>
              )}
              <div className="message-bubble">{message.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="输入消息..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!inputMessage.trim()}
        >
          发送
        </button>
      </form>
    </div>
  );
};

export default Chat;
