// 取消登录限制 - 所有请求都允许通过
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 尝试获取 token，如果没有则使用默认游客用户
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      // 如果有 token，尝试验证
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      } else {
        // 使用默认游客用户
        req.user = { _id: 'guest', username: '游客', isGuest: true };
      }
    } else {
      // 无 token 时使用游客身份
      req.user = { _id: 'guest', username: '游客', isGuest: true };
    }
    next();
  } catch (error) {
    // 验证失败时也使用游客身份
    req.user = { _id: 'guest', username: '游客', isGuest: true };
    next();
  }
};

module.exports = auth;
