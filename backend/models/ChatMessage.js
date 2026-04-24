const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text'
  },
  // 是否被撤回
  isRecalled: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 索引：按房间和时间查询
chatMessageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
