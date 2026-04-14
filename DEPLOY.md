# 🚀 强的可怕 - 云端部署指南

## 部署架构

- **前端**: Vercel (https://vercel.com)
- **后端**: Render (https://render.com)
- **数据库**: MongoDB Atlas (https://mongodb.com/atlas)

---

## 第一步：创建 MongoDB Atlas 数据库

1. 访问 https://www.mongodb.com/atlas/database
2. 注册/登录账号
3. 创建新项目，命名为 "qiangdekepa"
4. 点击 "Build a Database"
5. 选择 **M0 Free** 免费套餐
6. 选择云服务提供商（推荐 AWS）和最近的区域（如亚太地区选 Singapore）
7. 点击 "Create Cluster"
8. 创建数据库用户：
   - 用户名：`admin`
   - 密码：生成一个强密码并保存
9. 在 "Network Access" 中添加 IP 白名单：
   - 点击 "Add IP Address"
   - 选择 "Allow Access from Anywhere" (0.0.0.0/0)
10. 回到 "Database" 页面，点击 "Connect"
11. 选择 "Drivers" → "Node.js"
12. 复制连接字符串，格式如下：
    ```
    mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/qiangdekepa?retryWrites=true&w=majority
    ```
    把 `<password>` 替换为你的实际密码

---

## 第二步：部署后端到 Render

1. 访问 https://dashboard.render.com/
2. 注册/登录账号（可以用 GitHub 账号）
3. 点击 "New Web Service"
4. 连接你的 GitHub 仓库（需要先推送到 GitHub）
5. 配置如下：
   - **Name**: `qiangdekepa-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. 点击 "Advanced" 添加环境变量：
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = 上面复制的 MongoDB 连接字符串
   - `JWT_SECRET` = 随机字符串（如：`mySuperSecretKey123`）
   - `CLIENT_URL` = `https://qiangdekepa.vercel.app`（后面再改）
7. 点击 "Create Web Service"
8. 等待部署完成，记录分配的域名（如：`https://qiangdekepa-backend.onrender.com`）

---

## 第三步：部署前端到 Vercel

1. 访问 https://vercel.com/
2. 注册/登录账号（可以用 GitHub 账号）
3. 点击 "Add New Project"
4. 导入你的 GitHub 仓库
5. 配置如下：
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
6. 添加环境变量：
   - `REACT_APP_API_URL` = 上面 Render 的域名（如：`https://qiangdekepa-backend.onrender.com`）
7. 点击 "Deploy"
8. 等待部署完成，获得域名（如：`https://qiangdekepa.vercel.app`）

---

## 第四步：配置跨域

1. 回到 Render 控制台
2. 编辑后端服务的环境变量
3. 更新 `CLIENT_URL` 为 Vercel 的实际域名
4. 保存后自动重新部署

---

## 完成！

现在你可以通过 Vercel 的域名访问网站了，把这个链接分享给同事即可！

---

## GitHub 推送命令（如果需要）

```bash
cd /Users/huohuo/qiangdekepa
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 在 GitHub 创建仓库后执行
git remote add origin https://github.com/你的用户名/qiangdekepa.git
git push -u origin main
```

---

## 注意事项

1. **Render 免费版**：15分钟无访问会自动休眠，下次访问需要等待10秒左右唤醒
2. **MongoDB Atlas 免费版**：512MB存储，适合小团队使用
3. **Vercel 免费版**：100GB/月流量，完全够用
4. **文件上传**：免费版不支持持久化存储，如需上传图片建议使用图床（如 Imgur、SM.MS）

---

## 自定义域名（可选）

如果你有自己的域名：

1. **Vercel**: 在 Project Settings → Domains 中添加域名
2. **Render**: 在 Settings → Custom Domains 中添加域名
3. 按照指引配置 DNS 解析

---

## 故障排查

**问题**: 前端无法连接后端
- 检查 `REACT_APP_API_URL` 是否正确设置
- 确保后端 `CLIENT_URL` 与前端域名匹配

**问题**: 数据库连接失败
- 检查 MongoDB Atlas 的 IP 白名单是否设置正确
- 确认连接字符串中的密码正确

**问题**: 实时聊天不工作
- Render 免费版支持 WebSocket，可能需要等待服务完全启动
