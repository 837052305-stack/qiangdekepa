const express = require('express');
const { body, validationResult } = require('express-validator');
const ChatRoom = require('../models/ChatRoom');
const ChatRoomMember = require('../models/ChatRoomMember');
const ChatMessage = require('../models/ChatMessage');
const auth = require('../middleware/auth');

const router = express.Router();

// 创建聊天室
router.post('/', auth, [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('聊天室名称需要2-50个字符'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('描述最多200字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, isPublic = true } = req.body;

    // 检查名称是否已存在
    const existingRoom = await ChatRoom.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: '聊天室名称已存在' });
    }

    // 创建聊天室
    const room = new ChatRoom({
      name,
      description,
      isPublic,
      owner: req.user._id,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`
    });

    await room.save();

    // 创建房主成员记录
    const member = new ChatRoomMember({
      room: room._id,
      user: req.user._id,
      role: 'owner',
      joinedAt: new Date()
    });
    await member.save();

    // 添加系统消息
    const systemMsg = new ChatMessage({
      room: room._id,
      sender: req.user._id,
      content: `${req.user.username} 创建了聊天室`,
      type: 'system'
    });
    await systemMsg.save();

    await room.populate('owner', 'username avatar');

    res.status(201).json({
      message: '聊天室创建成功',
      room
    });
  } catch (error) {
    console.error('创建聊天室错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取聊天室列表（支持搜索）
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    const rooms = await ChatRoom.find(query)
      .populate('owner', 'username avatar')
      .populate('lastMessage.sender', 'username')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ChatRoom.countDocuments(query);

    res.json({
      rooms,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('获取聊天室列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取我加入的聊天室
router.get('/my-rooms', auth, async (req, res) => {
  try {
    const memberships = await ChatRoomMember.find({
      user: req.user._id,
      role: { $in: ['owner', 'admin', 'member'] }
    }).populate({
      path: 'room',
      populate: {
        path: 'lastMessage.sender',
        select: 'username'
      }
    });

    const rooms = memberships.map(m => ({
      ...m.room.toObject(),
      myRole: m.role
    }));

    res.json(rooms);
  } catch (error) {
    console.error('获取我的聊天室错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取聊天室详情
router.get('/:id', auth, async (req, res) => {
  try {
    const room = await ChatRoom.findById(req.params.id)
      .populate('owner', 'username avatar');

    if (!room) {
      return res.status(404).json({ message: '聊天室不存在' });
    }

    // 检查用户是否已加入
    const membership = await ChatRoomMember.findOne({
      room: req.params.id,
      user: req.user._id
    });

    res.json({
      room,
      myRole: membership ? membership.role : null
    });
  } catch (error) {
    console.error('获取聊天室详情错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 申请加入聊天室
router.post('/:id/join', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const room = await ChatRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: '聊天室不存在' });
    }

    // 检查是否已在房间
    const existing = await ChatRoomMember.findOne({
      room: req.params.id,
      user: req.user._id
    });

    if (existing) {
      if (existing.role === 'pending') {
        return res.status(400).json({ message: '您已提交申请，请等待审核' });
      }
      if (['owner', 'admin', 'member'].includes(existing.role)) {
        return res.status(400).json({ message: '您已是该聊天室成员' });
      }
    }

    // 公开房间直接加入，私密房间需要审核
    const role = room.isPublic ? 'member' : 'pending';

    const member = new ChatRoomMember({
      room: req.params.id,
      user: req.user._id,
      role,
      applyReason: reason
    });

    await member.save();

    if (room.isPublic) {
      // 更新成员数
      room.memberCount = await ChatRoomMember.countDocuments({
        room: req.params.id,
        role: { $in: ['owner', 'admin', 'member'] }
      });
      await room.save();

      // 添加系统消息
      const msg = new ChatMessage({
        room: req.params.id,
        sender: req.user._id,
        content: `${req.user.username} 加入了聊天室`,
        type: 'system'
      });
      await msg.save();

      res.json({ message: '加入成功', status: 'joined' });
    } else {
      res.json({ message: '申请已提交，等待房主审核', status: 'pending' });
    }
  } catch (error) {
    console.error('申请加入错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取待审核列表（房主/管理员）
router.get('/:id/pending', auth, async (req, res) => {
  try {
    // 检查权限
    const membership = await ChatRoomMember.findOne({
      room: req.params.id,
      user: req.user._id,
      role: { $in: ['owner', 'admin'] }
    });

    if (!membership) {
      return res.status(403).json({ message: '无权限查看' });
    }

    const pending = await ChatRoomMember.find({
      room: req.params.id,
      role: 'pending'
    }).populate('user', 'username avatar');

    res.json(pending);
  } catch (error) {
    console.error('获取待审核列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 审核通过/拒绝
router.put('/:id/members/:userId', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'approve' 或 'reject'

    // 检查权限
    const membership = await ChatRoomMember.findOne({
      room: req.params.id,
      user: req.user._id,
      role: { $in: ['owner', 'admin'] }
    });

    if (!membership) {
      return res.status(403).json({ message: '无权限操作' });
    }

    const targetMember = await ChatRoomMember.findOne({
      room: req.params.id,
      user: req.params.userId,
      role: 'pending'
    });

    if (!targetMember) {
      return res.status(404).json({ message: '申请记录不存在' });
    }

    if (action === 'approve') {
      targetMember.role = 'member';
      await targetMember.save();

      // 更新成员数
      const room = await ChatRoom.findById(req.params.id);
      room.memberCount = await ChatRoomMember.countDocuments({
        room: req.params.id,
        role: { $in: ['owner', 'admin', 'member'] }
      });
      await room.save();

      // 添加系统消息
      const msg = new ChatMessage({
        room: req.params.id,
        sender: req.params.userId,
        content: `新成员加入了聊天室`,
        type: 'system'
      });
      await msg.save();

      res.json({ message: '已同意加入申请' });
    } else {
      targetMember.role = 'rejected';
      await targetMember.save();
      res.json({ message: '已拒绝加入申请' });
    }
  } catch (error) {
    console.error('审核错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取聊天室成员列表
router.get('/:id/members', auth, async (req, res) => {
  try {
    // 检查用户是否是成员
    const myMembership = await ChatRoomMember.findOne({
      room: req.params.id,
      user: req.user._id,
      role: { $in: ['owner', 'admin', 'member'] }
    });

    if (!myMembership) {
      return res.status(403).json({ message: '您不是该聊天室成员' });
    }

    const members = await ChatRoomMember.find({
      room: req.params.id,
      role: { $in: ['owner', 'admin', 'member'] }
    }).populate('user', 'username avatar')
      .sort({ role: 1, joinedAt: 1 });

    res.json(members);
  } catch (error) {
    console.error('获取成员列表错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取聊天消息
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // 检查用户是否是成员
    const membership = await ChatRoomMember.findOne({
      room: req.params.id,
      user: req.user._id,
      role: { $in: ['owner', 'admin', 'member'] }
    });

    if (!membership) {
      return res.status(403).json({ message: '您不是该聊天室成员' });
    }

    const messages = await ChatMessage.find({
      room: req.params.id,
      isRecalled: false
    })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    console.error('获取消息错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
