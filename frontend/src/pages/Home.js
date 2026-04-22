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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

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

  const fetchTools = async (page = 1) => {
    try {
      setLoading(true);
      const params = { category, sort: sortBy, limit: 15, page };
      if (searchQuery) {
        params.search = searchQuery;
      }
      const response = await api.get('/api/tools', { params });
      setTools(response.data.tools);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('获取工具列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sortBy]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchTools(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTools(1);
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
            <>
              <div className="tools-count" style={{ textAlign: 'center', marginBottom: '16px', color: '#666' }}>
                共 {total} 个工具，第 {currentPage}/{totalPages} 页
              </div>
              <div className="tools-grid">
                {tools.map((tool) => (
                  <ToolCard key={tool._id} tool={tool} />
                ))}
              </div>
              {/* 分页组件 */}
              {totalPages > 1 && (
                <div className="pagination" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '32px',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn"
                    style={{
                      opacity: currentPage === 1 ? 0.5 : 1,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ← 上一页
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className="btn"
                      style={{
                        backgroundColor: currentPage === page ? '#4F46E5' : 'white',
                        color: currentPage === page ? 'white' : '#333',
                        minWidth: '40px',
                        padding: '8px 12px'
                      }}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn"
                    style={{
                      opacity: currentPage === totalPages ? 0.5 : 1,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    下一页 →
                  </button>
                </div>
              )}
            </>
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
