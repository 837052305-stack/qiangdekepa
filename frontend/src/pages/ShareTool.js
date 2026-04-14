import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ShareTool = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    link: '',
    image: '',
    category: '其他',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    '文本生成',
    '图像生成',
    '代码辅助',
    '数据分析',
    '语音识别',
    '视频生成',
    '其他'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await api.post('/api/tools', data);
      navigate(`/tool/${response.data.tool._id}`);
    } catch (error) {
      setError(error.response?.data?.message || '分享失败，请重试');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ maxWidth: '600px' }}>
      <h2 className="auth-title">分享 AI 工具 🚀</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">工具名称 *</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="例如：ChatGPT"
          />
        </div>

        <div className="form-group">
          <label className="form-label">工具描述 *</label>
          <textarea
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="介绍这个工具的功能和特点..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label className="form-label">工具链接 *</label>
          <input
            type="url"
            name="link"
            className="form-input"
            value={formData.link}
            onChange={handleChange}
            required
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">封面图片 URL</label>
          <input
            type="url"
            name="image"
            className="form-input"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://...（可选）"
          />
        </div>

        <div className="form-group">
          <label className="form-label">分类 *</label>
          <select
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">标签</label>
          <input
            type="text"
            name="tags"
            className="form-input"
            value={formData.tags}
            onChange={handleChange}
            placeholder="用逗号分隔，例如：AI, 写作, 免费"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? '发布中...' : '发布工具'}
        </button>
      </form>
    </div>
  );
};

export default ShareTool;
