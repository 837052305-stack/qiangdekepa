require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// 路由
const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const { router: chatRoutes, addMessage, addOnlineUser, removeOnlineUser, getOnlineUsersList } = require('./routes/chat');

// 连接数据库
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '强的可怕 API 服务运行中！' });
});

// Socket.io 连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  // 用户加入聊天
  socket.on('join_chat', (userData) => {
    if (userData && userData.username) {
      addOnlineUser(socket.id, userData);

      // 广播用户加入消息
      const joinMessage = {
        type: 'system',
        content: `${userData.username} 加入了聊天室`,
        user: userData
      };

      const savedMessage = addMessage(joinMessage);
      io.emit('message', savedMessage);

      // 更新在线用户列表
      io.emit('online_users', getOnlineUsersList());

      console.log(`${userData.username} 加入了聊天室`);
    }
  });

  // 接收并广播消息
  socket.on('send_message', (data) => {
    const { text, user } = data;

    if (user && user.username && text) {
      const message = {
        type: 'user',
        content: text,
        user: user
      };

      const savedMessage = addMessage(message);
      io.emit('message', savedMessage);

      console.log(`${user.username}: ${text}`);
    }
  });

  // 用户正在输入
  socket.on('typing', (data) => {
    socket.broadcast.emit('user_typing', data);
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    const userData = getOnlineUsersList().find(
      u => onlineUsers.has(socket.id)
    );

    removeOnlineUser(socket.id);

    if (userData) {
      // 广播用户离开消息
      const leaveMessage = {
        type: 'system',
        content: `${userData.username} 离开了聊天室`,
        user: userData
      };

      const savedMessage = addMessage(leaveMessage);
      io.emit('message', savedMessage);

      // 更新在线用户列表
      io.emit('online_users', getOnlineUsersList());

      console.log(`${userData.username} 离开了聊天室`);
    }

    console.log('用户断开连接:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 强的可怕 服务器启动成功！`);
  console.log(`📡 端口: ${PORT}`);
  console.log(`=================================`);
});
