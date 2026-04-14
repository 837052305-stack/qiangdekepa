const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// 存储聊天记录（生产环境应该使用数据库）
const chatHistory = [];
const MAX_HISTORY = 100;

// 获取聊天历史
router.get('/history', auth, (req, res) => {
  try {
    res.json(chatHistory.slice(-50)); // 返回最近50条消息
  } catch (error) {
    console.error('获取聊天历史错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 添加聊天消息（由Socket.io调用）
const addMessage = (message) => {
  const messageWithTimestamp = {
    ...message,
    _id: Date.now().toString(),
    createdAt: new Date()
  };

  chatHistory.push(messageWithTimestamp);

  // 限制历史记录数量
  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.shift();
  }

  return messageWithTimestamp;
};

// 获取在线用户列表（由Socket.io管理）
let onlineUsers = new Map();

const addOnlineUser = (socketId, userData) => {
  onlineUsers.set(socketId, userData);
};

const removeOnlineUser = (socketId) => {
  onlineUsers.delete(socketId);
};

const getOnlineUsersList = () => {
  return Array.from(onlineUsers.values());
};

module.exports = {
  router,
  addMessage,
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsersList
};
