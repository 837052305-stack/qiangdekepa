const express = require('express');
const { body, validationResult } = require('express-validator');
const Tool = require('../models/Tool');
const User = require('../models/User');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// 获取所有工具
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, sort = 'newest' } = req.query;
    const query = {};

    // 分类筛选
    if (category && category !== 'all') {
      query.category = category;
    }

    // 搜索功能
    if (search) {
      query.$text = { $search: search };
    }

    // 排序
    let sortOption = {};
    switch (sort) {
      case 'popular':
        sortOption = { likesCount: -1, views: -1 };
        break;
      case 'mostCommented':
        sortOption = { commentsCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const tools = await Tool.find(query)
      .populate('author', 'username avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Tool.countDocuments(query);

    res.json({
      tools,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取工具列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取单个工具详情
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('likes', 'username avatar');

    if (!tool) {
      return res.status(404).json({ message: '工具不存在' });
    }

    // 增加浏览量
    tool.views += 1;
    await tool.save();

    res.json(tool);
  } catch (error) {
    console.error('获取工具详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建新工具
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('工具名称不能为空'),
  body('description').trim().notEmpty().withMessage('描述不能为空'),
  body('link').isURL().withMessage('请输入有效的链接')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, link, image, tags, category } = req.body;

    const tool = new Tool({
      name,
      description,
      link,
      image: image || '',
      tags: tags || [],
      category: category || '其他',
      author: req.user._id
    });

    await tool.save();
    await tool.populate('author', 'username avatar');

    res.status(201).json({
      message: '工具分享成功',
      tool
    });
  } catch (error) {
    console.error('创建工具错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新工具
router.put('/:id', auth, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: '工具不存在' });
    }

    // 检查是否是作者
    if (tool.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限编辑此工具' });
    }

    const { name, description, link, image, tags, category } = req.body;

    tool.name = name || tool.name;
    tool.description = description || tool.description;
    tool.link = link || tool.link;
    tool.image = image || tool.image;
    tool.tags = tags || tool.tags;
    tool.category = category || tool.category;

    await tool.save();
    await tool.populate('author', 'username avatar');

    res.json({
      message: '工具更新成功',
      tool
    });
  } catch (error) {
    console.error('更新工具错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除工具
router.delete('/:id', auth, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: '工具不存在' });
    }

    // 检查是否是作者
    if (tool.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限删除此工具' });
    }

    // 删除相关评论
    await Comment.deleteMany({ tool: tool._id });

    await tool.deleteOne();

    res.json({ message: '工具已删除' });
  } catch (error) {
    console.error('删除工具错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 点赞/取消点赞工具
router.post('/:id/like', auth, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return res.status(404).json({ message: '工具不存在' });
    }

    const userLiked = tool.likes.includes(req.user._id);

    if (userLiked) {
      // 取消点赞
      tool.likes = tool.likes.filter(
        like => like.toString() !== req.user._id.toString()
      );
      tool.likesCount -= 1;
    } else {
      // 添加点赞
      tool.likes.push(req.user._id);
      tool.likesCount += 1;
    }

    await tool.save();

    res.json({
      message: userLiked ? '取消点赞成功' : '点赞成功',
      liked: !userLiked,
      likesCount: tool.likesCount
    });
  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 收藏/取消收藏工具
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const toolId = req.params.id;

    const isFavorited = user.favorites.includes(toolId);

    if (isFavorited) {
      user.favorites = user.favorites.filter(
        fav => fav.toString() !== toolId
      );
    } else {
      user.favorites.push(toolId);
    }

    await user.save();

    res.json({
      message: isFavorited ? '取消收藏成功' : '收藏成功',
      favorited: !isFavorited
    });
  } catch (error) {
    console.error('收藏错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户收藏的工具
router.get('/user/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'author', select: 'username avatar' }
    });

    res.json(user.favorites);
  } catch (error) {
    console.error('获取收藏错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
