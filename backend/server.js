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
const chatRoutes = require('./routes/chat');
const chatRoomRoutes = require('./routes/chatRooms');

// 模型
const ChatMessage = require('./models/ChatMessage');
const ChatRoomMember = require('./models/ChatRoomMember');
const ChatRoom = require('./models/ChatRoom');

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
app.use('/api/chat-rooms', chatRoomRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '强的可怕 API 服务运行中！' });
});

// Socket.io 连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  // 用户加入特定聊天室
  socket.on('join_room', async (data) => {
    const { roomId, user } = data;

    if (!roomId || !user) return;

    // 验证用户是否是房间成员
    const membership = await ChatRoomMember.findOne({
      room: roomId,
      user: user._id,
      role: { $in: ['owner', 'admin', 'member'] }
    });

    if (!membership) {
      socket.emit('error', { message: '您不是该聊天室成员' });
      return;
    }

    // 离开之前的房间
    const rooms = Array.from(socket.rooms);
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    // 加入新房间
    socket.join(roomId);
    socket.userId = user._id;
    socket.username = user.username;
    socket.roomId = roomId;

    // 广播用户加入（仅在该房间内）
    socket.to(roomId).emit('user_joined', {
      user,
      message: `${user.username} 进入了聊天室`
    });

    console.log(`${user.username} 加入房间 ${roomId}`);
  });

  // 发送消息到特定房间
  socket.on('send_message', async (data) => {
    const { roomId, content, user } = data;

    if (!roomId || !content || !user) return;

    try {
      // 验证成员身份
      const membership = await ChatRoomMember.findOne({
        room: roomId,
        user: user._id,
        role: { $in: ['owner', 'admin', 'member'] }
      });

      if (!membership) {
        socket.emit('error', { message: '无权限发送消息' });
        return;
      }

      // 保存消息到数据库
      const message = new ChatMessage({
        room: roomId,
        sender: user._id,
        content,
        type: 'text'
      });
      await message.save();
      await message.populate('sender', 'username avatar');

      // 更新房间最后消息
      await ChatRoom.findByIdAndUpdate(roomId, {
        lastMessage: {
          content,
          sender: user._id,
          createdAt: new Date()
        }
      });

      // 广播消息给房间内所有人
      io.to(roomId).emit('new_message', message);

      console.log(`${user.username} 在房间 ${roomId} 发送: ${content}`);
    } catch (error) {
      console.error('发送消息错误:', error);
      socket.emit('error', { message: '发送失败' });
    }
  });

  // 用户正在输入
  socket.on('typing', (data) => {
    const { roomId, user } = data;
    socket.to(roomId).emit('user_typing', { user });
  });

  // 用户断开连接
  socket.on('disconnect', () => {
    if (socket.roomId && socket.username) {
      socket.to(socket.roomId).emit('user_left', {
        message: `${socket.username} 离开了聊天室`
      });
      console.log(`${socket.username} 离开房间 ${socket.roomId}`);
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
