#!/bin/bash

# 🚀 强的可怕 - 一键部署脚本
# 使用方法:
# 1. 先修改下面的 GITHUB_USERNAME 为你的 GitHub 用户名
# 2. 在终端运行: chmod +x deploy.sh && ./deploy.sh

GITHUB_USERNAME="你的GitHub用户名"  # <-- 修改这里！

if [ "$GITHUB_USERNAME" = "你的GitHub用户名" ]; then
    echo "❌ 错误: 请先修改脚本中的 GITHUB_USERNAME 变量！"
    exit 1
fi

echo "🚀 开始部署 强的可怕..."
echo ""

# 检查是否在正确目录
if [ ! -f "package.json" ] && [ ! -d "backend" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

echo "📦 步骤 1/4: 初始化 Git 仓库..."
git init
git config user.email "deploy@qiangdekepa.com"
git config user.name "Deploy Bot"

echo "📦 步骤 2/4: 添加文件..."
git add .

echo "📦 步骤 3/4: 提交代码..."
git commit -m "Initial commit - 强的可怕 AI工具分享平台" || echo "代码已提交，继续..."

echo "📦 步骤 4/4: 推送到 GitHub..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$GITHUB_USERNAME/qiangdekepa.git"
git branch -M main
git push -u origin main

echo ""
echo "✅ 代码已推送到 GitHub!"
echo ""
echo "📝 接下来的步骤:"
echo "1. 访问 https://github.com/$GITHUB_USERNAME/qiangdekepa 确认代码已上传"
echo "2. 按照 DEPLOY_COMPLETE.md 的步骤创建 MongoDB Atlas"
echo "3. 部署后端到 Render: https://dashboard.render.com/"
echo "4. 部署前端到 Vercel: https://vercel.com/"
echo ""
echo "🌐 部署完成后，你的网站将是:"
echo "   https://qiangdekepa.vercel.app"
