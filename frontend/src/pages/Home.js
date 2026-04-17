import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import api from '../services/api';

const Home = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { value: 'all', label: '全部分类' },
    { value: '文本生成', label: '文本生成' },
    { value: '图像生成', label: '图像生成' },
    { value: '代码辅助', label: '代码辅助' },
    { value: '数据分析', label: '数据分析' },
    { value: '语音识别', label: '语音识别' },
    { value: '视频生成', label: '视频生成' },
    { value: '其他', label: '其他' }
  ];

  useEffect(() => {
    fetchTools();
  }, [category, sortBy]);
                                                                                                             
    useEffect(() => {                                                                                                   
      fetchTools();                                                                                                     
      // eslint-disable-next-line react-hooks/exhaustive-deps                                                           
    }, [category, sortBy]);                                                         
    }, [category, sortBy]);   
      const params = { category, sort: sortBy };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await api.get('/api/tools', { params });
      setTools(response.data.tools);
    } catch (error) {
      console.error('获取工具列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTools();
  };

  return (
    <div>
      {/* Hero区域 */}
      <div className="hero">
        <h1 className="hero-title">🚀 强的可怕</h1>
        <p className="hero-subtitle">发现、分享、探讨最强大的 AI 工具</p>

        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="搜索 AI 工具..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            🔍 搜索
          </button>
        </form>
      </div>

      {/* 筛选栏 */}
      <div className="filter-bar">
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">最新发布</option>
          <option value="popular">最受欢迎</option>
          <option value="mostCommented">最多讨论</option>
        </select>

        <Link to="/share">
          <button className="btn btn-primary">+ 分享工具</button>
        </Link>
      </div>

      {/* 工具列表 */}
      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <>
          {tools.length > 0 ? (
            <div className="tools-grid">
              {tools.map((tool) => (
                <ToolCard key={tool._id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">暂无工具</h3>
              <p>还没有这个分类的工具，快来分享第一个吧！</p>
              <Link to="/share">
                <button className="btn btn-primary" style={{ marginTop: '16px' }}>
                  分享工具
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
