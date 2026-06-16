import React from 'react';

const Featured = () => {
  const featuredTools = [
    {
      id: 1,
      name: 'Gemini',
      description: 'Google 推出的先进 AI 助手，基于 Gemini 大模型，支持多模态理解和生成。拥有强大的推理能力、编程辅助、创意写作等功能，支持与 Google 服务深度集成。',
      link: 'https://gemini.google.com/',
      image: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
      category: '文本生成',
      tags: ['Google', '多模态', 'AI助手', '编程'],
      color: '#4285f4'
    },
    {
      id: 2,
      name: 'Midjourney',
      description: '全球领先的 AI 图像生成工具，通过文本描述创造出令人惊叹的艺术作品。以其独特的艺术风格、高质量的图像输出和活跃的创作者社区而闻名。',
      link: 'https://www.midjourney.com/home',
      image: 'https://cdn.midjourney.com/midjourney-logo.png',
      category: '图像生成',
      tags: ['图像生成', '艺术创作', 'AI绘画', '设计'],
      color: '#1a1a2e'
    },
    {
      id: 3,
      name: '即梦 AI',
      description: '字节跳动旗下的 AI 创作平台，支持文生图、图生图等多种创作方式。针对中文用户优化，提供丰富的中国风格模板和便捷的创作体验。',
      link: 'https://jimeng.jianying.com/ai-tool/home',
      image: 'https://lf-web-font.douyinstatic.com/obj/ttfe-juejin/jimeng-logo.png',
      category: '图像生成',
      tags: ['字节跳动', '文生图', '中文优化', '国产AI'],
      color: '#ff0050'
    }
  ];

  return (
    <div>
      {/* 页面标题 */}
      <div className="hero" style={{ padding: '40px 20px' }}>
        <h1 className="hero-title">⭐ 最佳推荐</h1>
        <p className="hero-subtitle">精选最强 AI 工具，助你效率翻倍</p>
      </div>

      {/* 推荐工具列表 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        {featuredTools.map((tool, index) => (
          <div
            key={tool.id}
            style={{
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              marginBottom: '32px',
              overflow: 'hidden',
              border: `2px solid ${tool.color}20`,
              transition: 'transform 0.3s, box-shadow 0.3s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 30px ${tool.color}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            {/* 排名标识 */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: tool.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                zIndex: 10,
              }}
            >
              {index + 1}
            </div>

            {/* 工具图标/图片区域 */}
            <div
              style={{
                width: window.innerWidth < 768 ? '100%' : '280px',
                minHeight: '200px',
                background: `linear-gradient(135deg, ${tool.color}15, ${tool.color}05)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '24px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 30px ${tool.color}30`,
                  fontSize: '48px',
                }}
              >
                {tool.name === 'Gemini' && '✨'}
                {tool.name === 'Midjourney' && '🎨'}
                {tool.name === '即梦 AI' && '✨'}
              </div>
            </div>

            {/* 工具信息区域 */}
            <div style={{ flex: 1, padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '28px', color: '#1a1a2e' }}>{tool.name}</h2>
                <span
                  style={{
                    padding: '4px 12px',
                    background: `${tool.color}15`,
                    color: tool.color,
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {tool.category}
                </span>
              </div>

              <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#555', marginBottom: '20px' }}>
                {tool.description}
              </p>

              {/* 标签 */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {tool.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '6px 14px',
                      background: '#f5f5f5',
                      borderRadius: '16px',
                      fontSize: '13px',
                      color: '#666',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 访问按钮 */}
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  background: tool.color,
                  color: 'white',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                🚀 立即访问
                <span style={{ fontSize: '18px' }}>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
        <p>更多优质 AI 工具，尽在 🚀 强的可怕</p>
      </div>
    </div>
  );
};

export default Featured;
