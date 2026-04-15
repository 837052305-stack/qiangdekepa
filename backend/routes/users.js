const express = require('express');
const User = require('../models/User');
const Tool = require('../models/Tool');
const auth = require('../middleware/auth');

const router = express.Router();

// 获取用户公开资料
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('following', 'username avatar')
      .populate('followers', 'username avatar');

    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 获取用户分享的工具
    const tools = await Tool.find({ author: user._id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({
      user,
      tools
    });
  } catch (error) {
    console.error('获取用户资料错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 关注/取消关注用户
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: '不能关注自己' });
    }

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // 取消关注
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUser._id.toString()
      );
    } else {
      // 添加关注
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? '已取消关注' : '关注成功',
      following: !isFollowing
    });
  } catch (error) {
    console.error('关注操作错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 搜索用户
router.get('/search/query', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const users = await User.find({
      username: { $regex: q, $options: 'i' }
    })
      .select('username avatar bio')
      .limit(10);

    res.json(users);
  } catch (error) {
    console.error('搜索用户错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
