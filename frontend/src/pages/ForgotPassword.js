import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">🔐 忘记密码</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <p style={{ marginBottom: '20px', color: '#64748b', textAlign: 'center' }}>
        请输入您的注册邮箱，我们将发送密码重置链接给您。
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">邮箱</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="请输入注册邮箱"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? '发送中...' : '发送重置链接'}
        </button>
      </form>

      <p className="auth-link">
        想起密码了？ <Link to="/login">返回登录</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
