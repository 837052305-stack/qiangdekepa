const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['文本生成', '图像生成', '代码辅助', '数据分析', '语音识别', '视频生成', '其他'],
    default: '其他'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 索引优化搜索
toolSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Tool', toolSchema);
