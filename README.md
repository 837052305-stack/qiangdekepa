# 🚀 强的可怕 - AI工具分享平台

一个用于同事之间相互分享AI工具、经验和链接的交流平台，支持实时聊天功能。

## ✨ 功能特点

- **🔐 用户系统** - 注册、登录、个人资料管理
- **🛠 工具分享** - 分享AI工具，包含名称、描述、链接、分类和标签
- **💬 讨论区** - 每个工具都有独立的评论区，可以交流使用心得
- **👍 互动功能** - 点赞、收藏、关注
- **🔍 搜索筛选** - 按分类、关键词搜索工具
- **💭 实时聊天** - Socket.io 实现的实时在线聊天室
- **📱 响应式设计** - 支持桌面和移动端访问

## 🛠 技术栈

### 后端
- Node.js + Express
- MongoDB + Mongoose
- Socket.io (实时通信)
- JWT (身份认证)
- bcryptjs (密码加密)

### 前端
- React 18
- React Router (路由)
- Axios (HTTP请求)
- Socket.io-client (实时通信)

## 📦 安装和运行

### 前置要求
- Node.js 16+
- MongoDB 4.4+

### 1. 克隆项目

```bash
cd qiangdekepa
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

编辑 `backend/.env` 文件：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qiangdekepa
JWT_SECRET=your_secret_key_here
```

### 4. 启动后端服务器

```bash
npm start
# 或开发模式（热重载）
npm run dev
```

### 5. 安装前端依赖（新终端）

```bash
cd ../frontend
npm install
```

### 6. 启动前端开发服务器

```bash
npm start
```

### 7. 访问应用

打开浏览器访问: http://localhost:3000

## 📁 项目结构

```
qiangdekepa/
├── backend/                 # 后端代码
│   ├── config/             # 配置文件
│   ├── middleware/         # 中间件
│   ├── models/             # 数据模型
│   │   ├── User.js         # 用户模型
│   │   ├── Tool.js         # 工具模型
│   │   └── Comment.js      # 评论模型
│   ├── routes/             # API路由
│   │   ├── auth.js         # 认证路由
│   │   ├── tools.js        # 工具路由
│   │   ├── comments.js     # 评论路由
│   │   ├── users.js        # 用户路由
│   │   └── chat.js         # 聊天路由
│   ├── server.js           # 服务器入口
│   └── package.json
│
├── frontend/               # 前端代码
│   ├── public/             # 静态资源
│   └── src/
│       ├── components/     # React组件
│       ├── context/        # React Context
│       ├── pages/          # 页面组件
│       ├── services/       # API服务
│       ├── App.js          # 主应用
│       ├── index.js        # 入口文件
│       └── styles.css      # 全局样式
│
└── README.md
```

## 🚀 部署

### 后端部署

1. 设置环境变量
2. 确保 MongoDB 可访问
3. 使用 PM2 或其他进程管理器运行

```bash
npm install -g pm2
pm2 start server.js --name "qiangdekepa-backend"
```

### 前端部署

```bash
cd frontend
npm run build
```

将 `build` 目录部署到静态服务器（如 Nginx、Vercel、Netlify 等）

## 🔧 API 文档

### 认证接口
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户

### 工具接口
- `GET /api/tools` - 获取工具列表
- `GET /api/tools/:id` - 获取工具详情
- `POST /api/tools` - 创建工具
- `PUT /api/tools/:id` - 更新工具
- `DELETE /api/tools/:id` - 删除工具
- `POST /api/tools/:id/like` - 点赞/取消点赞
- `POST /api/tools/:id/favorite` - 收藏/取消收藏

### 评论接口
- `GET /api/comments/tool/:toolId` - 获取工具评论
- `POST /api/comments` - 发表评论
- `DELETE /api/comments/:id` - 删除评论

### 用户接口
- `GET /api/users/:id` - 获取用户资料
- `POST /api/users/:id/follow` - 关注/取消关注

### 聊天接口
- `GET /api/chat/history` - 获取聊天历史
- WebSocket: `connection` - 实时聊天

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
