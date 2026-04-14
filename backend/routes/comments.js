const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Tool = require('../models/Tool');
const auth = require('../middleware/auth');

const router = express.Router();

// 获取工具的评论列表
router.get('/tool/:toolId', async (req, res) => {
  try {
    const comments = await Comment.find({
      tool: req.params.toolId,
      parentComment: null
    })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username avatar' }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 创建评论
router.post('/', auth, [
  body('content').trim().notEmpty().withMessage('评论内容不能为空'),
  body('toolId').notEmpty().withMessage('工具ID不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, toolId, parentCommentId } = req.body;

    // 检查工具是否存在
    const tool = await Tool.findById(toolId);
    if (!tool) {
      return res.status(404).json({ message: '工具不存在' });
    }

    const comment = new Comment({
      content,
      tool: toolId,
      author: req.user._id,
      parentComment: parentCommentId || null
    });

    await comment.save();

    // 更新工具评论数
    tool.commentsCount += 1;
    await tool.save();

    // 如果是回复，添加到父评论的replies数组
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    }

    await comment.populate('author', 'username avatar');

    res.status(201).json({
      message: '评论发布成功',
      comment
    });
  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 删除评论
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论不存在' });
    }

    // 检查是否是作者
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限删除此评论' });
    }

    // 更新工具评论数
    const tool = await Tool.findById(comment.tool);
    if (tool) {
      tool.commentsCount = Math.max(0, tool.commentsCount - 1);
      await tool.save();
    }

    // 如果是回复，从父评论中移除
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    }

    // 删除所有回复
    if (comment.replies.length > 0) {
      await Comment.deleteMany({ _id: { $in: comment.replies } });
      if (tool) {
        tool.commentsCount = Math.max(0, tool.commentsCount - comment.replies.length);
        await tool.save();
      }
    }

    await comment.deleteOne();

    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
