import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        await api.get(`/api/auth/reset-password/${token}`);
        setValidToken(true);
      } catch (err) {
        setValidToken(false);
        setError('重置链接无效或已过期');
      } finally {
        setChecking(false);
      }
    };
    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`/api/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || '重置失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="auth-container">
        <div className="loading">验证中...</div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="auth-container">
        <h2 className="auth-title">❌ 链接已过期</h2>
        <div className="error-message">{error}</div>
        <p className="auth-link">
          <Link to="/forgot-password">重新申请重置</Link> 或 <Link to="/login">返回登录</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2 className="auth-title">🔑 重置密码</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">新密码</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="请输入新密码（至少6位）"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">确认新密码</label>
          <input
            type="password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="请再次输入新密码"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? '重置中...' : '重置密码'}
        </button>
      </form>

      <p className="auth-link">
        <Link to="/login">返回登录</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
