require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 路由
const authRoutes = require('./routes/auth');
const toolRoutes = require('./routes/tools');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

// 连接数据库
connectDB();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '强的可怕 API 服务运行中！' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 强的可怕 服务器启动成功！`);
  console.log(`📡 端口: ${PORT}`);
  console.log(`=================================`);
});
