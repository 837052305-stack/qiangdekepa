# 🚀 强的可怕 - 5分钟部署到公网

## 架构
- **前端**: Vercel (https://vercel.com) - 免费
- **后端**: Render (https://render.com) - 免费
- **数据库**: MongoDB Atlas (https://mongodb.com/atlas) - 免费 512MB

---

## 第一步：准备代码

### 1. 创建 GitHub 仓库

访问 https://github.com/new 创建新仓库，命名为 `qiangdekepa`

### 2. 推送代码

```bash
cd /Users/huohuo/qiangdekepa

# 初始化 git
git init
git add .
git commit -m "Initial commit"

# 连接到你的 GitHub 仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/qiangdekepa.git
git branch -M main
git push -u origin main
```

---

## 第二步：创建 MongoDB Atlas 数据库

1. 访问 https://www.mongodb.com/atlas/database
2. 用邮箱/Google账号注册
3. 创建新项目，命名为 `qiangdekepa`
4. 点击 "Build a Database"
5. 选择 **M0 Free** 免费套餐
6. 选择云服务：**AWS** + 区域 **Singapore (ap-southeast-1)**
7. 点击 "Create Cluster"
8. 创建数据库用户：
   - 用户名：`admin`
   - 密码：点击 "Autogenerate Secure Password" 并复制保存
9. 点击 "Create User"
10. 在 "Network Access" 点击 "Add IP Address"
11. 选择 "Allow Access from Anywhere" (0.0.0.0/0)，点击 "Confirm"
12. 回到 "Database" 页面，点击 "Connect" → "Drivers" → "Node.js"
13. 复制连接字符串，格式：
    ```
    mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/qiangdekepa?retryWrites=true&w=majority
    ```
    把 `<password>` 替换为刚才保存的密码

**保存好这个连接字符串，后面要用！**

---

## 第三步：部署后端到 Render

1. 访问 https://dashboard.render.com/
2. 用 GitHub 账号登录
3. 点击 "New Web Service"
4. 找到你的 `qiangdekepa` 仓库，点击 "Connect"
5. 配置：
   - **Name**: `qiangdekepa-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. 点击 "Advanced" 展开，添加环境变量：

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `MONGODB_URI` | 上面保存的 MongoDB 连接字符串 |
   | `JWT_SECRET` | 随机字符串，如 `mySuperSecretKey123` |
   | `CLIENT_URL` | `https://qiangdekepa.vercel.app` |

7. 点击 "Create Web Service"
8. 等待部署完成（约2-3分钟）
9. 记录分配的域名，如：`https://qiangdekepa-api.onrender.com`

---

## 第四步：部署前端到 Vercel

1. 访问 https://vercel.com/
2. 用 GitHub 账号登录
3. 点击 "Add New Project"
4. 导入 `qiangdekepa` 仓库
5. 配置：
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
6. 添加环境变量：
   - `REACT_APP_API_URL` = 上面 Render 的域名（如 `https://qiangdekepa-api.onrender.com`）
7. 点击 "Deploy"
8. 等待部署完成（约1-2分钟）

---

## 第五步：完成！

你现在有了两个链接：

| 用途 | 链接 |
|------|------|
| **访问网站** | `https://qiangdekepa.vercel.app` |
| **API 地址** | `https://qiangdekepa-api.onrender.com` |

把 `https://qiangdekepa.vercel.app` 分享给同事，所有人都能访问！

---

## 自定义域名（可选）

如果你有自己的域名（如 `qiangdekepa.com`）：

### Vercel 绑定域名
1. 进入 Vercel 项目 → Settings → Domains
2. 添加你的域名
3. 按照指引配置 DNS 解析

### Render 绑定域名
1. 进入 Render 项目 → Settings → Custom Domains
2. 添加你的域名
3. 更新前端的环境变量为自定义域名

---

## 注意事项

1. **Render 免费版**：15分钟无访问会自动休眠，下次访问需等待10秒唤醒
2. **MongoDB Atlas**：512MB 存储，超出需要升级
3. **Vercel 免费版**：100GB/月流量，够用
4. **数据备份**：定期导出 MongoDB 数据

---

## 故障排查

**问题1**: 前端显示 "无法连接到服务器"
- 检查 `REACT_APP_API_URL` 是否正确
- 确保 Render 服务已启动

**问题2**: 注册/登录失败
- 检查 MongoDB 连接字符串是否正确
- 检查 IP 白名单是否设置为 0.0.0.0/0

**问题3**: 实时聊天不工作
- Render 支持 WebSocket，等待服务完全启动
- 检查浏览器控制台是否有错误

---

## 更新代码

以后修改代码后：
```bash
git add .
git commit -m "更新内容"
git push
```

Vercel 和 Render 会自动重新部署！
