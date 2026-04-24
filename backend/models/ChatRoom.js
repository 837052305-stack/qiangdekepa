const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    unique: true
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://api.dicebear.com/7.x/identicon/svg?seed=default'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  // 成员数量（用于显示，实际从ChatRoomMember计算）
  memberCount: {
    type: Number,
    default: 1
  },
  // 最后一条消息预览
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: Date
  },
  // 是否活跃
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 搜索索引
chatRoomSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
