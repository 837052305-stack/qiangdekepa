const mongoose = require('mongoose');

const chatRoomMemberSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // 身份：owner(房主), admin(管理员), member(成员), pending(待审核), rejected(已拒绝)
  role: {
    type: String,
    enum: ['owner', 'admin', 'member', 'pending', 'rejected'],
    default: 'pending'
  },
  // 申请理由（待审核时）
  applyReason: {
    type: String,
    maxlength: 200
  },
  // 加入时间
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 复合唯一索引：一个用户在一个房间只有一条记录
chatRoomMemberSchema.index({ room: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('ChatRoomMember', chatRoomMemberSchema);
