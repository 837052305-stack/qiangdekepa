# 🚀 强的可怕 - 完整部署指南

## 📋 部署前准备

你需要准备：
1. **GitHub 账号** - 托管代码
2. **邮箱** - 注册各种服务（可以用同一个邮箱）

预计时间：**15-20分钟**

---

## 第一步：创建 GitHub 仓库（2分钟）

1. 访问 https://github.com/new
2. Repository name 填写：`qiangdekepa`
3. 选择 **Public**（公开）
4. 点击 **Create repository**
5. 复制你的仓库地址，如：`https://github.com/你的用户名/qiangdekepa.git`

---

## 第二步：上传代码到 GitHub（3分钟）

在你的电脑上打开终端，执行：

```bash
cd /Users/huohuo/qiangdekepa

# 初始化 git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit - 强的可怕 AI工具分享平台"

# 连接到你的仓库（替换 你的用户名 为实际的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/qiangdekepa.git

# 推送代码
git branch -M main
git push -u origin main
```

✅ **完成后刷新 GitHub 页面，应该能看到所有代码**

---

## 第三步：创建 MongoDB Atlas 数据库（5分钟）

### 3.1 注册账号
1. 访问 https://www.mongodb.com/atlas/database
2. 点击 "Try Free"
3. 用邮箱注册（可以用 Google 账号快速登录）

### 3.2 创建数据库
1. 登录后点击 "Build a Database"
2. 选择 **M0 FREE** 免费套餐
3. Provider 选择 **AWS**
4. Region 选择 **Singapore (ap-southeast-1)**（亚洲最快）
5. 点击 "Create Cluster"（等待约2分钟）

### 3.3 设置访问权限
1. 在弹出的窗口中：
   - Username: `admin`
   - Password: 点击 "Autogenerate Secure Password"
   - **⚠️ 重要：复制这个密码，保存到记事本！**
2. 点击 "Create User"
3. 在 "Where would you like to connect from?" 选择 "My Local Environment"
4. 点击 "Add My Current IP Address"
5. 再点击 "Add IP Address"，输入 `0.0.0.0/0`（允许任何地方访问）
6. 点击 "Finish and Close"

### 3.4 获取连接字符串
1. 点击 "Database" → 点击 "Connect"
2. 选择 "Drivers"
3. 选择 "Node.js"
4. 复制连接字符串，格式如下：
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. **把 `<password>` 替换为刚才保存的密码**
6. **在链接最后添加数据库名**：把 `/?retryWrites` 改成 `/qiangdekepa?retryWrites`

**最终格式示例**：
```
mongodb+srv://admin:ABC123xyz@cluster0.abc123.mongodb.net/qiangdekepa?retryWrites=true&w=majority&appName=Cluster0
```

**保存这个连接字符串，后面要用！**

---

## 第四步：部署后端到 Render（5分钟）

### 4.1 注册并连接
1. 访问 https://dashboard.render.com/
2. 点击 "Get Started for Free"
3. 选择 "Continue with GitHub"
4. 授权 Render 访问你的 GitHub 仓库

### 4.2 创建 Web Service
1. 点击 "New Web Service"
2. 找到你的 `qiangdekepa` 仓库，点击 "Connect"
3. 配置如下：
   - **Name**: `qiangdekepa-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 4.3 添加环境变量
点击 "Advanced" 按钮，添加以下环境变量：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | 上面保存的 MongoDB 连接字符串 |
| `JWT_SECRET` | 随机字符串（如：`mySecretKey123!@#`） |
| `CLIENT_URL` | `https://qiangdekepa.vercel.app` |

点击 "Create Web Service"

### 4.4 等待部署完成
- 等待约 3-5 分钟
- 看到 "Your service is live" 表示成功
- **记录你的后端地址**，如：`https://qiangdekepa-api.onrender.com`

---

## 第五步：部署前端到 Vercel（5分钟）

### 5.1 注册并导入
1. 访问 https://vercel.com/
2. 点击 "Sign Up" → "Continue with GitHub"
3. 点击 "Add New Project"
4. 导入你的 `qiangdekepa` 仓库

### 5.2 配置项目
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. 点击展开 "Environment Variables"
4. 添加：
   - `REACT_APP_API_URL` = 你的 Render 后端地址（如 `https://qiangdekepa-api.onrender.com`）

### 5.3 部署
点击 "Deploy"

等待约 2-3 分钟，部署完成后：
- **点击 "Continue to Dashboard"**
- **记录你的前端地址**，如：`https://qiangdekepa.vercel.app`

---

## 第六步：配置跨域（重要！）

### 6.1 更新 Render 环境变量
1. 回到 Render Dashboard: https://dashboard.render.com/
2. 点击你的 `qiangdekepa-api` 服务
3. 点击左侧 "Environment"
4. 修改 `CLIENT_URL` 为你的实际 Vercel 地址
   - 把 `https://qiangdekepa.vercel.app` 改成你的实际地址
5. 点击 "Save Changes"
6. 等待自动重新部署（约1分钟）

---

## 🎉 完成！

现在你有两个链接：

| 用途 | 链接示例 |
|------|----------|
| **网站地址** | `https://qiangdekepa.vercel.app` |
| **API地址** | `https://qiangdekepa-api.onrender.com` |

**把网站地址分享给同事，所有人都能访问！**

---

## 🔧 常见问题

### Q1: 网页显示 "无法连接到服务器"
- 检查 `REACT_APP_API_URL` 是否正确
- 检查 Render 服务是否已启动（免费版15分钟无访问会休眠，首次访问需等待10秒）
- 检查 MongoDB 连接字符串是否正确

### Q2: 注册/登录失败
- 检查 MongoDB Atlas 的 IP 白名单是否设置为 `0.0.0.0/0`
- 检查 MongoDB 连接字符串中的密码是否正确

### Q3: 实时聊天不工作
- 等待 Render 服务完全启动
- 打开浏览器开发者工具(F12)查看 Console 是否有错误

### Q4: 如何更新网站？
修改代码后，在终端执行：
```bash
cd /Users/huohuo/qiangdekepa
git add .
git commit -m "更新内容"
git push
```
Vercel 和 Render 会自动重新部署！

---

## 📞 需要帮助？

如果遇到问题：
1. 检查每个步骤是否按照说明操作
2. 查看 Render 和 Vercel 的日志（Dashboard → Logs）
3. 检查浏览器开发者工具(F12)的 Console 错误信息

