import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateChatRoom = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/chat-rooms', formData);
      navigate(`/chat-room/${response.data.room._id}`);
    } catch (err) {
      setError(err.response?.data?.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">创建聊天室 💬</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">聊天室名称 *</label>
          <input
            type="text"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={50}
            placeholder="给你的聊天室起个名字"
          />
        </div>

        <div className="form-group">
          <label className="form-label">描述</label>
          <textarea
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            maxLength={200}
            placeholder="介绍一下这个聊天室的主题..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            {' '}公开聊天室（任何人可直接加入）
          </label>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            如果关闭，新成员需要你的审核才能加入
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? '创建中...' : '创建聊天室'}
        </button>
      </form>
    </div>
  );
};

export default CreateChatRoom;
