import React from 'react';

const HighFrequency = () => {
  // 高频使用的AI工具数据
  const hotTools = [
    {
      id: 1,
      name: 'ChatGPT',
      description: 'OpenAI 开发的对话式 AI，全球使用最广泛的智能助手，支持写作、编程、问答、翻译等多种任务。',
      link: 'https://chat.openai.com/',
      icon: '🤖',
      category: '对话AI',
      users: '10亿+',
      color: '#10a37f'
    },
    {
      id: 2,
      name: 'Claude',
      description: 'Anthropic 开发的 AI 助手，擅长长文本处理、代码编写和分析推理，以安全性和可靠性著称。',
      link: 'https://claude.ai/',
      icon: '🧠',
      category: '对话AI',
      users: '千万+',
      color: '#d97757'
    },
    {
      id: 3,
      name: '文心一言',
      description: '百度推出的中文大模型，针对中文语境优化，支持对话、写作、绘画等多种功能。',
      link: 'https://yiyan.baidu.com/',
      icon: '📝',
      category: '国产AI',
      users: '亿级',
      color: '#2932e1'
    },
    {
      id: 4,
      name: 'Kimi',
      description: '月之暗面推出的 AI 助手，支持超长文本（200万字上下文），擅长文献阅读和长文总结。',
      link: 'https://kimi.moonshot.cn/',
      icon: '🌙',
      category: '长文本',
      users: '千万+',
      color: '#4f46e5'
    },
    {
      id: 5,
      name: '通义千问',
      description: '阿里云推出的AI大模型，支持多轮对话、文案创作、逻辑推理，与阿里生态深度整合。',
      link: 'https://tongyi.aliyun.com/',
      icon: '☁️',
      category: '国产AI',
      users: '千万+',
      color: '#ff6a00'
    },
    {
      id: 6,
      name: '豆包',
      description: '字节跳动推出的 AI 助手，集成在抖音生态中，支持聊天、写作、英语学习等功能。',
      link: 'https://www.doubao.com/',
      icon: '📦',
      category: '国产AI',
      users: '千万+',
      color: '#ff0050'
    }
  ];

  return (
    <div>
      {/* 页面标题 */}
      <div className="hero" style={{
        padding: '50px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <h1 className="hero-title" style={{ color: 'white' }}>🔥 高频使用</h1>
        <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }}>
          大家都在用的热门 AI 工具，即用即走
        </p>
      </div>

      {/* 高频工具网格 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {hotTools.map((tool) => (
            <div
              key={tool.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `2px solid ${tool.color}20`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 12px 40px ${tool.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              {/* 顶部装饰条 */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: tool.color
              }} />

              {/* 图标和名称 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: `${tool.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}>
                  {tool.icon}
                </div>
                <div>
                  <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: '22px',
                    color: '#1a1a2e'
                  }}>
                    {tool.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      padding: '2px 10px',
                      background: `${tool.color}15`,
                      color: tool.color,
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      {tool.category}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#888'
                    }}>
                      👥 {tool.users}用户
                    </span>
                  </div>
                </div>
              </div>

              {/* 描述 */}
              <p style={{
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#555',
                marginBottom: '20px',
                minHeight: '67px'
              }}>
                {tool.description}
              </p>

              {/* 访问按钮 */}
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: tool.color,
                  color: 'white',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  transition: 'opacity 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                🚀 立即使用
                <span>→</span>
              </a>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div style={{
          textAlign: 'center',
          marginTop: '50px',
          padding: '30px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '16px'
        }}>
          <h3 style={{ marginBottom: '12px', color: '#333' }}>
            💡 提示
          </h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            这些工具均为高频使用的AI服务，无需注册即可访问。<br/>
            点击"立即使用"按钮即可跳转到官方页面。
          </p>
        </div>
      </div>
    </div>
  );
};

export default HighFrequency;
