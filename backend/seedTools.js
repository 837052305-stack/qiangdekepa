const mongoose = require('mongoose');
const Tool = require('./models/Tool');
const User = require('./models/User');
require('dotenv').config();

// 31个AI工具数据
const toolsData = [
  {
    name: 'ChatGPT',
    description: 'OpenAI 开发的强大对话 AI，可以回答问题、写作、编程、翻译等。',
    link: 'https://chat.openai.com',
    category: '文本生成',
    tags: ['AI', '对话', '免费']
  },
  {
    name: 'Claude',
    description: 'Anthropic 开发的 AI 助手，擅长长文本处理和分析。',
    link: 'https://claude.ai',
    category: '文本生成',
    tags: ['AI', '长文本', '免费']
  },
  {
    name: 'Midjourney',
    description: '通过文本描述生成高质量艺术图像的 AI 工具。',
    link: 'https://www.midjourney.com',
    category: '图像生成',
    tags: ['AI绘画', '艺术', '付费']
  },
  {
    name: 'DALL-E 3',
    description: 'OpenAI 的图像生成工具，根据文字描述创建逼真图像。',
    link: 'https://openai.com/dall-e-3',
    category: '图像生成',
    tags: ['AI绘画', 'OpenAI', '高清']
  },
  {
    name: 'GitHub Copilot',
    description: 'AI 编程助手，能自动补全代码、生成函数、解释代码。',
    link: 'https://github.com/features/copilot',
    category: '代码辅助',
    tags: ['编程', 'IDE插件', '付费']
  },
  {
    name: 'Gemini',
    description: 'Google 开发的多模态 AI，支持文本、图像、代码理解。',
    link: 'https://gemini.google.com',
    category: '文本生成',
    tags: ['Google', '多模态', '免费']
  },
  {
    name: 'Stable Diffusion',
    description: '开源图像生成模型，可在本地运行，社区资源丰富。',
    link: 'https://stability.ai',
    category: '图像生成',
    tags: ['开源', '本地运行', '免费']
  },
  {
    name: 'Runway Gen-2',
    description: 'AI 视频生成工具，用文本或图片生成高质量视频。',
    link: 'https://runwayml.com',
    category: '视频生成',
    tags: ['视频', 'AI生成', '创意']
  },
  {
    name: 'Kimi',
    description: '月之暗面开发的中文 AI 助手，支持超长文本处理。',
    link: 'https://kimi.moonshot.cn',
    category: '文本生成',
    tags: ['国产', '长文本', '中文']
  },
  {
    name: 'Perplexity',
    description: 'AI 搜索引擎，提供带引用来源的答案。',
    link: 'https://www.perplexity.ai',
    category: '文本生成',
    tags: ['搜索', '引用', '研究']
  },
  {
    name: 'Notion AI',
    description: 'Notion 内置的 AI 助手，辅助写作、总结和头脑风暴。',
    link: 'https://www.notion.so/product/ai',
    category: '文本生成',
    tags: ['笔记', '写作', '生产力']
  },
  {
    name: 'Leonardo AI',
    description: '游戏资产和概念艺术生成工具，提供免费额度。',
    link: 'https://leonardo.ai',
    category: '图像生成',
    tags: ['游戏', '概念艺术', '免费额度']
  },
  {
    name: 'Pika',
    description: 'AI 视频编辑工具，用文字编辑视频内容。',
    link: 'https://pika.art',
    category: '视频生成',
    tags: ['视频编辑', 'AI', '创意']
  },
  {
    name: 'Sora',
    description: 'OpenAI 的文本生成视频模型，可生成高质量短视频。',
    link: 'https://openai.com/sora',
    category: '视频生成',
    tags: ['视频', 'OpenAI', '生成式']
  },
  {
    name: '文心一言',
    description: '百度开发的中文大语言模型，支持多轮对话。',
    link: 'https://yiyan.baidu.com',
    category: '文本生成',
    tags: ['百度', '国产', '中文']
  },
  {
    name: '通义千问',
    description: '阿里巴巴开发的 AI 大模型，支持多种应用场景。',
    link: 'https://tongyi.aliyun.com',
    category: '文本生成',
    tags: ['阿里', '国产', '多模态']
  },
  {
    name: 'HeyGen',
    description: 'AI 数字人视频生成工具，支持多种语言和口型同步。',
    link: 'https://www.heygen.com',
    category: '视频生成',
    tags: ['数字人', '视频', '多语言']
  },
  {
    name: '智谱清言',
    description: '智谱 AI 开发的中文助手，基于 ChatGLM 大模型。',
    link: 'https://chatglm.cn',
    category: '文本生成',
    tags: ['智谱', '国产', 'ChatGLM']
  },
  {
    name: 'Adobe Firefly',
    description: 'Adobe 的创意生成 AI，集成在 Photoshop 等软件中。',
    link: 'https://www.adobe.com/products/firefly.html',
    category: '图像生成',
    tags: ['Adobe', '创意', '设计']
  },
  {
    name: 'Canva AI',
    description: 'Canva 内置的 AI 设计助手，快速生成海报、PPT等。',
    link: 'https://www.canva.com/ai-design/',
    category: '图像生成',
    tags: ['设计', '模板', '易用']
  },
  {
    name: 'Copy.ai',
    description: '营销文案 AI 生成工具，适合广告、社媒内容创作。',
    link: 'https://www.copy.ai',
    category: '文本生成',
    tags: ['营销', '文案', '广告']
  },
  {
    name: 'Jasper',
    description: '企业级 AI 写作助手，支持长文、营销、SEO内容。',
    link: 'https://www.jasper.ai',
    category: '文本生成',
    tags: ['企业', 'SEO', '长文']
  },
  {
    name: 'Bing AI',
    description: '微软必应集成的 AI 搜索助手，基于 GPT-4。',
    link: 'https://www.bing.com/chat',
    category: '文本生成',
    tags: ['微软', '搜索', '免费']
  },
  {
    name: 'Cursor',
    description: 'AI 原生代码编辑器，基于 GPT-4，支持代码生成和重构。',
    link: 'https://cursor.sh',
    category: '代码辅助',
    tags: ['编辑器', 'AI编程', '免费']
  },
  {
    name: 'Tabnine',
    description: '专业的 AI 代码补全工具，支持多种编程语言。',
    link: 'https://www.tabnine.com',
    category: '代码辅助',
    tags: ['代码补全', 'IDE', '多语言']
  },
  {
    name: 'Codeium',
    description: '免费的 AI 编程助手，类似 Copilot，完全免费。',
    link: 'https://codeium.com',
    category: '代码辅助',
    tags: ['免费', '代码补全', '开源']
  },
  {
    name: 'Replicate',
    description: 'AI 模型运行平台，可运行各种开源图像、视频模型。',
    link: 'https://replicate.com',
    category: '图像生成',
    tags: ['平台', '开源', 'API']
  },
  {
    name: 'Hugging Face',
    description: '最大的 AI 模型社区，提供各种开源模型和工具。',
    link: 'https://huggingface.co',
    category: '其他',
    tags: ['社区', '开源', '模型']
  },
  {
    name: 'Descript',
    description: 'AI 音视频编辑工具，用文字编辑音频和视频。',
    link: 'https://www.descript.com',
    category: '语音识别',
    tags: ['音视频', '编辑', '转录']
  },
  {
    name: 'Otter.ai',
    description: 'AI 会议记录和转录工具，自动生成会议纪要。',
    link: 'https://otter.ai',
    category: '语音识别',
    tags: ['会议', '转录', '效率']
  },
  {
    name: 'Grammarly',
    description: 'AI 写作助手，检查语法、风格和语气。',
    link: 'https://www.grammarly.com',
    category: '文本生成',
    tags: ['写作', '语法', '校对']
  },
  {
    name: 'DeepSeek',
    description: '深度求索开发的大语言模型，推理能力强大，支持代码生成和数学计算。',
    link: 'https://chat.deepseek.com',
    category: '文本生成',
    tags: ['国产', '推理', '代码', '免费']
  },
  {
    name: 'Gemini Advanced',
    description: 'Google 最强 AI 模型，支持超长上下文和复杂任务处理。',
    link: 'https://gemini.google.com/advanced',
    category: '文本生成',
    tags: ['Google', '多模态', '付费']
  },
  {
    name: 'CodeGeeX',
    description: '智谱 AI 开源的代码生成模型，支持 20+ 编程语言。',
    link: 'https://codegeex.cn',
    category: '代码辅助',
    tags: ['国产', '开源', '免费']
  },
  {
    name: 'Poe',
    description: '聚合多个 AI 模型的聊天平台，包括 GPT-4、Claude、Gemini 等。',
    link: 'https://poe.com',
    category: '文本生成',
    tags: ['聚合', '多模型', '免费额度']
  },
  {
    name: 'Merlin',
    description: '浏览器 AI 助手插件，可在任何网页使用 ChatGPT。',
    link: 'https://merlin.foyer.work',
    category: '文本生成',
    tags: ['浏览器插件', '便捷', '免费']
  },
  {
    name: 'you.com',
    description: 'AI 搜索引擎，结合大模型提供智能搜索体验。',
    link: 'https://you.com',
    category: '文本生成',
    tags: ['搜索', 'AI', '免费']
  },
  {
    name: 'Gamma',
    description: 'AI 生成演示文稿工具，一键生成精美的 PPT。',
    link: 'https://gamma.app',
    category: '文本生成',
    tags: ['PPT', '演示', '设计']
  },
  {
    name: 'Tome',
    description: 'AI 驱动的故事讲述工具，快速生成叙事性演示文稿。',
    link: 'https://tome.app',
    category: '文本生成',
    tags: ['演示', '故事', '创意']
  },
  {
    name: 'Beautiful.ai',
    description: '智能演示文稿制作工具，自动排版和设计。',
    link: 'https://www.beautiful.ai',
    category: '文本生成',
    tags: ['PPT', '设计', '智能排版']
  },
  {
    name: 'Fliki',
    description: 'AI 视频生成工具，将文字转换为视频内容。',
    link: 'https://fliki.ai',
    category: '视频生成',
    tags: ['视频', '文字转视频', '配音']
  },
  {
    name: 'Synthesia',
    description: 'AI 数字人视频生成平台，支持 120+ 语言和口音。',
    link: 'https://www.synthesia.io',
    category: '视频生成',
    tags: ['数字人', '多语言', '企业']
  },
  {
    name: 'ElevenLabs',
    description: '顶级 AI 语音合成工具，生成超逼真的人声。',
    link: 'https://elevenlabs.io',
    category: '语音识别',
    tags: ['语音合成', '配音', '多语言']
  },
  {
    name: 'Murf.ai',
    description: 'AI 配音工具，提供多种专业语音风格。',
    link: 'https://murf.ai',
    category: '语音识别',
    tags: ['配音', '语音合成', '视频']
  },
  {
    name: 'Lovo',
    description: 'AI 语音生成平台，提供 500+ 种声音风格。',
    link: 'https://lovo.ai',
    category: '语音识别',
    tags: ['配音', '多声音', '情感']
  },
  {
    name: 'Speechify',
    description: 'AI 文本朗读工具，将任何文字转换为语音。',
    link: 'https://speechify.com',
    category: '语音识别',
    tags: ['朗读', '学习', '辅助']
  },
  {
    name: 'Remove.bg',
    description: 'AI 自动去除图片背景，一键抠图工具。',
    link: 'https://www.remove.bg',
    category: '图像生成',
    tags: ['抠图', '背景去除', '免费']
  },
  {
    name: 'Upscayl',
    description: '开源 AI 图片放大工具，无损提升图片分辨率。',
    link: 'https://upscayl.org',
    category: '图像生成',
    tags: ['开源', '图片放大', '免费']
  },
  {
    name: 'Clipdrop',
    description: 'Stability AI 推出的图像编辑工具套件。',
    link: 'https://clipdrop.co',
    category: '图像生成',
    tags: ['图像编辑', 'Stable Diffusion', '多功能']
  },
  {
    name: 'Playground AI',
    description: '免费在线 AI 绘画工具，基于 Stable Diffusion。',
    link: 'https://playgroundai.com',
    category: '图像生成',
    tags: ['免费', 'AI绘画', '在线']
  },
  {
    name: 'BlueWillow',
    description: '免费的 Midjourney 替代品，通过 Discord 使用。',
    link: 'https://www.bluewillow.ai',
    category: '图像生成',
    tags: ['免费', 'Discord', 'AI绘画']
  },
  {
    name: 'AutoDraw',
    description: 'Google 推出的 AI 绘画工具，自动识别并优化涂鸦。',
    link: 'https://www.autodraw.com',
    category: '图像生成',
    tags: ['Google', '涂鸦', '简单']
  },
  {
    name: 'This Person Does Not Exist',
    description: '生成不存在的人脸照片，每次刷新都是新面孔。',
    link: 'https://thispersondoesnotexist.com',
    category: '图像生成',
    tags: ['人脸生成', '趣味', '免费']
  },
  {
    name: 'NightCafe',
    description: 'AI 艺术创作社区，支持多种艺术风格生成。',
    link: 'https://nightcafe.studio',
    category: '图像生成',
    tags: ['艺术社区', '多风格', '创意']
  },
  {
    name: 'Artbreeder',
    description: 'AI 图像混合工具，通过调整滑块创造新图像。',
    link: 'https://www.artbreeder.com',
    category: '图像生成',
    tags: ['图像混合', '创意', '协作']
  },
  {
    name: 'Vercel AI SDK',
    description: '构建 AI 应用的开发工具包，支持流式响应。',
    link: 'https://sdk.vercel.ai',
    category: '代码辅助',
    tags: ['开发工具', 'SDK', '开源']
  },
  {
    name: 'LangChain',
    description: '构建 LLM 应用的框架，简化 AI 应用开发。',
    link: 'https://www.langchain.com',
    category: '代码辅助',
    tags: ['框架', 'LLM', '开源']
  },
  {
    name: 'LlamaIndex',
    description: '数据框架，用于连接 LLM 与私有数据。',
    link: 'https://www.llamaindex.ai',
    category: '代码辅助',
    tags: ['RAG', '数据连接', '开源']
  },
  {
    name: 'TensorFlow',
    description: 'Google 开源机器学习框架，支持深度学习。',
    link: 'https://www.tensorflow.org',
    category: '数据分析',
    tags: ['机器学习', '深度学习', '开源']
  },
  {
    name: 'PyTorch',
    description: 'Meta 开源深度学习框架，研究和生产首选。',
    link: 'https://pytorch.org',
    category: '数据分析',
    tags: ['深度学习', '研究', '开源']
  },
  {
    name: 'Gradio',
    description: '快速创建和共享机器学习模型演示界面。',
    link: 'https://www.gradio.app',
    category: '代码辅助',
    tags: ['演示', 'ML', '开源']
  },
  {
    name: 'Streamlit',
    description: '快速构建数据应用的 Python 库。',
    link: 'https://streamlit.io',
    category: '代码辅助',
    tags: ['数据应用', 'Python', '开源']
  },
  {
    name: 'Weights & Biases',
    description: '机器学习实验跟踪和可视化平台。',
    link: 'https://wandb.ai',
    category: '数据分析',
    tags: ['实验跟踪', 'ML', '可视化']
  },
  {
    name: 'Kaggle',
    description: '数据科学社区和竞赛平台，提供数据集和 Notebook。',
    link: 'https://www.kaggle.com',
    category: '数据分析',
    tags: ['数据科学', '竞赛', '学习']
  },
  {
    name: 'Colab',
    description: 'Google 免费的云端 Jupyter Notebook 环境。',
    link: 'https://colab.research.google.com',
    category: '数据分析',
    tags: ['Google', '免费', 'GPU']
  },
  {
    name: 'Papers With Code',
    description: '机器学习论文和代码实现的数据库。',
    link: 'https://paperswithcode.com',
    category: '数据分析',
    tags: ['论文', '代码', '研究']
  },
  {
    name: 'Futurepedia',
    description: '最大的 AI 工具目录，收录 5000+ AI 工具。',
    link: 'https://www.futurepedia.io',
    category: '其他',
    tags: ['工具目录', '导航', '资源']
  },
  {
    name: 'TheresAnAIForThat',
    description: 'AI 工具搜索引擎，按用例分类的 AI 工具库。',
    link: 'https://theresanaiforthat.com',
    category: '其他',
    tags: ['工具目录', '搜索', '资源']
  },
  {
    name: 'Product Hunt',
    description: '发现和分享新产品的社区，AI 产品专区。',
    link: 'https://www.producthunt.com',
    category: '其他',
    tags: ['产品发现', '社区', '新产品']
  },
  {
    name: 'AIToolMall',
    description: '国内 AI 工具导航站，收录国内主流 AI 产品。',
    link: 'https://www.aitoolmall.com',
    category: '其他',
    tags: ['国产', '导航', '工具目录']
  },
  {
    name: 'Warp',
    description: 'AI 驱动的现代终端，支持智能命令补全。',
    link: 'https://www.warp.dev',
    category: '代码辅助',
    tags: ['终端', '开发工具', 'AI']
  },
  {
    name: 'Fig',
    description: '命令行自动补全工具，已被 AWS 收购。',
    link: 'https://fig.io',
    category: '代码辅助',
    tags: ['终端', '自动补全', '开发工具']
  },
  {
    name: 'Sourcegraph Cody',
    description: 'AI 代码助手，理解整个代码库上下文。',
    link: 'https://sourcegraph.com/cody',
    category: '代码辅助',
    tags: ['代码搜索', 'AI编程', '企业']
  },
  {
    name: 'Mintlify',
    description: 'AI 驱动的文档编写工具，自动生成 API 文档。',
    link: 'https://mintlify.com',
    category: '代码辅助',
    tags: ['文档', '开发者', '自动化']
  },
  {
    name: 'ReadMe',
    description: 'API 文档托管平台，集成 AI 辅助编写。',
    link: 'https://readme.com',
    category: '代码辅助',
    tags: ['API文档', '开发者', '文档']
  },
  {
    name: 'D-ID',
    description: 'AI 数字人视频生成，将照片变成会说话的视频。',
    link: 'https://www.d-id.com',
    category: '视频生成',
    tags: ['数字人', '视频', '创意']
  },
  {
    name: 'CapCut',
    description: '剪映国际版，集成 AI 视频编辑功能。',
    link: 'https://www.capcut.com',
    category: '视频生成',
    tags: ['视频编辑', 'AI', '免费']
  },
  {
    name: 'Descript',
    description: '革命性的音视频编辑工具，用文字编辑媒体。',
    link: 'https://www.descript.com',
    category: '视频生成',
    tags: ['音视频', '编辑', '转录']
  },
  {
    name: 'Kaiber',
    description: 'AI 音乐视频生成工具，根据音乐生成视觉内容。',
    link: 'https://kaiber.ai',
    category: '视频生成',
    tags: ['音乐视频', 'AI', '创意']
  },
  {
    name: 'Wonder Studio',
    description: 'AI 自动将真人替换为 CG 角色，无需动捕设备。',
    link: 'https://wonderdynamics.com',
    category: '视频生成',
    tags: ['CG', '特效', '电影']
  },
  {
    name: 'LeiaPix',
    description: '将 2D 图片转换为 3D 动态视觉效果。',
    link: 'https://leiapix.com',
    category: '图像生成',
    tags: ['2D转3D', '动态', '创意']
  },
  {
    name: 'Luma AI',
    description: '用手机生成高质量的 3D 模型和 NeRF。',
    link: 'https://lumalabs.ai',
    category: '图像生成',
    tags: ['3D', 'NeRF', '扫描']
  },
  {
    name: 'Meshy',
    description: '文本或图像生成 3D 模型，支持 PBR 材质。',
    link: 'https://www.meshy.ai',
    category: '图像生成',
    tags: ['3D', '模型生成', '游戏']
  },
  {
    name: 'Scenario',
    description: 'AI 游戏资产生成平台，专门用于游戏开发。',
    link: 'https://www.scenario.gg',
    category: '图像生成',
    tags: ['游戏', '资产', '批量生成']
  },
  {
    name: 'Rosebud AI',
    description: 'AI 游戏开发平台，文本描述生成游戏。',
    link: 'https://rosebud.ai',
    category: '代码辅助',
    tags: ['游戏开发', 'AI', '无代码']
  },
  {
    name: 'PromptHero',
    description: 'AI 图像提示词搜索引擎，发现优秀提示词。',
    link: 'https://prompthero.com',
    category: '其他',
    tags: ['提示词', '搜索', '学习']
  },
  {
    name: 'Lexica',
    description: 'Stable Diffusion 图像搜索引擎，提供提示词参考。',
    link: 'https://lexica.art',
    category: '其他',
    tags: ['图像搜索', '提示词', '灵感']
  },
  {
    name: 'Civitai',
    description: 'Stable Diffusion 模型分享社区。',
    link: 'https://civitai.com',
    category: '图像生成',
    tags: ['模型', '社区', 'Stable Diffusion']
  },
  {
    name: 'Hugging Face Spaces',
    description: '免费托管和分享 ML 应用 demo 的平台。',
    link: 'https://huggingface.co/spaces',
    category: '其他',
    tags: ['ML Demo', '免费托管', '社区']
  },
  {
    name: 'Anthropic Console',
    description: 'Claude API 控制台，开发和测试 Claude 应用。',
    link: 'https://console.anthropic.com',
    category: '其他',
    tags: ['API', '开发', 'Claude']
  },
  {
    name: 'OpenAI Playground',
    description: 'OpenAI API 交互式测试环境。',
    link: 'https://platform.openai.com/playground',
    category: '其他',
    tags: ['API', '测试', 'GPT']
  },
  {
    name: 'Chatbot Arena',
    description: 'LMSYS 的 LLM 对战平台，盲测不同模型。',
    link: 'https://chat.lmsys.org',
    category: '其他',
    tags: ['评测', '对比', 'LLM']
  },
  {
    name: 'GPT-4V(ision)',
    description: 'OpenAI 的视觉理解模型，可分析图片内容。',
    link: 'https://chat.openai.com',
    category: '其他',
    tags: ['视觉', '多模态', '图像理解']
  },
  {
    name: 'Claude Artifacts',
    description: 'Claude 的交互式内容生成功能，支持代码预览。',
    link: 'https://claude.ai',
    category: '代码辅助',
    tags: ['代码预览', '交互', '生成']
  },
  {
    name: 'Suno',
    description: 'AI 音乐生成工具，根据文本描述创作歌曲。',
    link: 'https://www.suno.ai',
    category: '语音识别',
    tags: ['音乐', '创作', '歌曲']
  },
  {
    name: 'Udio',
    description: 'AI 音乐生成平台，生成高质量人声歌曲。',
    link: 'https://www.udio.com',
    category: '语音识别',
    tags: ['音乐', '人声', '创作']
  },
  {
    name: 'AIVA',
    description: 'AI 音乐作曲助手，适合影视配乐创作。',
    link: 'https://www.aiva.ai',
    category: '语音识别',
    tags: ['音乐', '作曲', '影视']
  },
  {
    name: 'Soundraw',
    description: 'AI 音乐生成工具，免版税背景音乐。',
    link: 'https://soundraw.io',
    category: '语音识别',
    tags: ['音乐', '背景音乐', '无版权']
  },
  {
    name: 'Beatoven.ai',
    description: 'AI 生成免版税音乐，适合视频配乐。',
    link: 'https://www.beatoven.ai',
    category: '语音识别',
    tags: ['音乐', '视频配乐', '免版权']
  },
  {
    name: 'Replika',
    description: 'AI 陪伴机器人，提供情感支持和对话。',
    link: 'https://replika.ai',
    category: '文本生成',
    tags: ['陪伴', '情感', '聊天']
  },
  {
    name: 'Character.AI',
    description: '创建和与各种 AI 角色对话的平台。',
    link: 'https://character.ai',
    category: '文本生成',
    tags: ['角色', '创意', '娱乐']
  },
  {
    name: 'Pi',
    description: 'Inflection AI 的个人 AI 助手，对话风格友好。',
    link: 'https://pi.ai',
    category: '文本生成',
    tags: ['个人助手', '友好', '对话']
  },
  {
    name: 'Phind',
    description: '专为开发者设计的 AI 搜索引擎。',
    link: 'https://www.phind.com',
    category: '代码辅助',
    tags: ['开发者', '搜索', '编程']
  },
  {
    name: 'Blackbox AI',
    description: 'AI 编程助手，支持 20+ 语言和 IDE。',
    link: 'https://www.useblackbox.io',
    category: '代码辅助',
    tags: ['编程', '多语言', 'IDE']
  },
  {
    name: 'Amazon CodeWhisperer',
    description: 'AWS 的 AI 编程助手，免费对个人开发者。',
    link: 'https://aws.amazon.com/codewhisperer',
    category: '代码辅助',
    tags: ['AWS', '免费', '编程']
  },
  {
    name: 'JetBrains AI',
    description: 'JetBrains IDE 内置的 AI 助手。',
    link: 'https://www.jetbrains.com/ai',
    category: '代码辅助',
    tags: ['JetBrains', 'IDE', 'AI']
  },
  {
    name: 'Bito',
    description: '基于 ChatGPT 的代码助手，支持多种 IDE。',
    link: 'https://bito.ai',
    category: '代码辅助',
    tags: ['ChatGPT', 'IDE插件', '代码']
  },
  {
    name: 'Whimsical',
    description: 'AI 驱动的流程图和思维导图工具。',
    link: 'https://whimsical.com',
    category: '文本生成',
    tags: ['思维导图', '流程图', '协作']
  },
  {
    name: 'Miro AI',
    description: '在线白板工具，集成 AI 辅助创意工作。',
    link: 'https://miro.com',
    category: '文本生成',
    tags: ['白板', '协作', '创意']
  },
  {
    name: 'Napkin',
    description: 'AI 驱动的视觉笔记工具，快速创建图文内容。',
    link: 'https://www.napkin.ai',
    category: '文本生成',
    tags: ['视觉笔记', '图文', '创意']
  },
  {
    name: 'Scribe',
    description: 'AI 自动生成操作指南和文档。',
    link: 'https://scribehow.com',
    category: '文本生成',
    tags: ['文档', '指南', '自动化']
  },
  {
    name: 'Mem.ai',
    description: 'AI 驱动的笔记应用，自动组织和关联笔记。',
    link: 'https://mem.ai',
    category: '文本生成',
    tags: ['笔记', '知识管理', 'AI']
  },
  {
    name: 'Reflect',
    description: 'AI 笔记工具，支持自动链接和网络化思考。',
    link: 'https://reflect.app',
    category: '文本生成',
    tags: ['笔记', '思考', '链接']
  },
  {
    name: 'Tana',
    description: 'AI 驱动的知识管理和工作空间工具。',
    link: 'https://tana.inc',
    category: '文本生成',
    tags: ['知识管理', '工作空间', 'AI']
  },
  {
    name: 'Taskade',
    description: 'AI 协作工作空间，集成任务管理和文档。',
    link: 'https://www.taskade.com',
    category: '文本生成',
    tags: ['协作', '任务管理', 'AI']
  },
  {
    name: 'Fireflies.ai',
    description: 'AI 会议助手，自动记录和总结会议。',
    link: 'https://fireflies.ai',
    category: '语音识别',
    tags: ['会议', '记录', '总结']
  },
  {
    name: 'Grain',
    description: 'AI 会议记录工具，自动生成会议亮点。',
    link: 'https://grain.com',
    category: '语音识别',
    tags: ['会议', '记录', '亮点']
  },
  {
    name: 'Read.ai',
    description: 'AI 会议分析工具，提供参与度和情绪分析。',
    link: 'https://www.read.ai',
    category: '语音识别',
    tags: ['会议', '分析', '情绪']
  },
  {
    name: 'Superhuman',
    description: 'AI 驱动的电子邮件客户端，智能分类和撰写。',
    link: 'https://superhuman.com',
    category: '文本生成',
    tags: ['邮件', '效率', 'AI']
  },
    {
    name: 'Shortwave',
    description: 'AI 邮件客户端，自动总结和智能回复。',
    link: 'https://www.shortwave.com',
    category: '文本生成',
    tags: ['邮件', '总结', 'AI']
  },
  {
    name: 'Lindy',
    description: '无代码 AI 工作流自动化平台。',
    link: 'https://www.lindy.ai',
    category: '其他',
    tags: ['自动化', '无代码', '工作流']
  },
  {
    name: 'Relevance AI',
    description: '构建 AI 代理和自动化工作流的平台。',
    link: 'https://relevanceai.com',
    category: '其他',
    tags: ['AI代理', '自动化', '企业']
  },
  {
    name: 'Bardeen',
    description: 'AI 浏览器自动化工具，一键创建工作流。',
    link: 'https://www.bardeen.ai',
    category: '其他',
    tags: ['浏览器', '自动化', '效率']
  },
  {
    name: 'Make',
    description: '可视化自动化平台，连接各种应用和服务。',
    link: 'https://www.make.com',
    category: '其他',
    tags: ['自动化', '集成', '工作流']
  },
  {
    name: 'Zapier AI',
    description: 'Zapier 的 AI 功能，自然语言创建自动化。',
    link: 'https://zapier.com/ai',
    category: '其他',
    tags: ['自动化', '集成', '自然语言']
  },
  {
    name: 'Browse AI',
    description: '无需代码，训练机器人自动抓取网站数据。',
    link: 'https://www.browse.ai',
    category: '数据分析',
    tags: ['爬虫', '数据抓取', '无代码']
  },
  {
    name: 'Octoparse',
    description: '可视化网页数据抓取工具，无需编程。',
    link: 'https://www.octoparse.com',
    category: '数据分析',
    tags: ['爬虫', '数据', '可视化']
  },
  {
    name: 'Apify',
    description: '网页抓取和自动化平台，支持多种用例。',
    link: 'https://apify.com',
    category: '数据分析',
    tags: ['爬虫', '自动化', '数据']
  },
  {
    name: 'Dust',
    description: '企业级 AI 助手平台，连接公司知识库。',
    link: 'https://dust.tt',
    category: '其他',
    tags: ['企业', '知识库', 'AI助手']
  },
  {
    name: 'Glean',
    description: '企业搜索和知识发现平台，AI 驱动。',
    link: 'https://www.glean.com',
    category: '其他',
    tags: ['企业搜索', '知识', '效率']
  },
  {
    name: 'Moveworks',
    description: '企业 IT 自动化 AI 平台，自动解决员工问题。',
    link: 'https://www.moveworks.com',
    category: '其他',
    tags: ['企业', 'IT', '自动化']
  },
  {
    name: 'Ada',
    description: '企业 AI 客服平台，自动化客户支持。',
    link: 'https://www.ada.cx',
    category: '其他',
    tags: ['客服', '企业', '自动化']
  },
  {
    name: 'Intercom Fin',
    description: 'Intercom 的 AI 客服机器人，基于 GPT-4。',
    link: 'https://www.intercom.com/fin',
    category: '其他',
    tags: ['客服', 'GPT-4', '企业']
  },
  {
    name: 'Drift',
    description: '对话式营销和销售平台，集成 AI 聊天机器人。',
    link: 'https://www.drift.com',
    category: '其他',
    tags: ['营销', '销售', '聊天机器人']
  },
  {
    name: 'Voiceflow',
    description: '可视化构建 AI 聊天机器人和语音助手的平台。',
    link: 'https://www.voiceflow.com',
    category: '其他',
    tags: ['聊天机器人', '语音', '无代码']
  },
  {
    name: 'Stack AI',
    description: '无代码构建自定义 AI 助手和聊天机器人。',
    link: 'https://www.stack-ai.com',
    category: '其他',
    tags: ['无代码', 'AI助手', '聊天']
  },
  {
    name: 'Chatbase',
    description: '基于自有数据训练 ChatGPT 聊天机器人。',
    link: 'https://www.chatbase.co',
    category: '其他',
    tags: ['聊天机器人', '自定义', '数据']
  },
  {
    name: 'SiteGPT',
    description: '为网站创建 AI 聊天机器人，自动回答访客问题。',
    link: 'https://sitegpt.ai',
    category: '其他',
    tags: ['网站', '客服', '聊天机器人']
  },
  {
    name: 'Syte.ai',
    description: '电商视觉搜索和推荐 AI 解决方案。',
    link: 'https://www.syte.ai',
    category: '图像生成',
    tags: ['电商', '视觉搜索', '推荐']
  },
  {
    name: 'ViSenze',
    description: '智能产品发现和视觉搜索平台。',
    link: 'https://www.visenze.com',
    category: '图像生成',
    tags: ['电商', '视觉搜索', 'AI']
  },
  {
    name: 'Vue.ai',
    description: '零售 AI 解决方案，包括个性化和视觉搜索。',
    link: 'https://vue.ai',
    category: '图像生成',
    tags: ['零售', '个性化', 'AI']
  },
  {
    name: 'Persado',
    description: 'AI 营销文案生成平台，优化转化率。',
    link: 'https://www.persado.com',
    category: '文本生成',
    tags: ['营销', '文案', '转化率']
  },
  {
    name: 'Anyword',
    description: '数据驱动的 AI 文案工具，预测内容表现。',
    link: 'https://anyword.com',
    category: '文本生成',
    tags: ['文案', '预测', '营销']
  },
  {
    name: 'Writer',
    description: '企业级 AI 写作平台，保持品牌一致性。',
    link: 'https://writer.com',
    category: '文本生成',
    tags: ['企业', '品牌', '写作']
  },
  {
    name: 'Typeface',
    description: '个性化内容创作平台，针对企业品牌定制。',
    link: 'https://www.typeface.ai',
    category: '文本生成',
    tags: ['个性化', '品牌', '内容']
  },
  {
    name: 'Midjourney Alpha',
    description: 'Midjourney 网页版，无需 Discord 即可使用。',
    link: 'https://alpha.midjourney.com',
    category: '图像生成',
    tags: ['Midjourney', '网页版', 'AI绘画']
  },
  {
    name: 'Adobe Express',
    description: 'Adobe 的在线设计工具，集成 Firefly AI。',
    link: 'https://www.adobe.com/express',
    category: '图像生成',
    tags: ['Adobe', '设计', 'Firefly']
  },
  {
    name: 'Microsoft Designer',
    description: '微软的 AI 设计工具，类似 Canva。',
    link: 'https://designer.microsoft.com',
    category: '图像生成',
    tags: ['微软', '设计', 'AI']
  },
  {
    name: 'Clipchamp',
    description: '微软的视频编辑工具，集成 AI 功能。',
    link: 'https://clipchamp.com',
    category: '视频生成',
    tags: ['微软', '视频编辑', 'AI']
  },
  {
    name: 'OpusClip',
    description: 'AI 自动将长视频剪辑成短视频 viral 片段。',
    link: 'https://www.opus.pro',
    category: '视频生成',
    tags: ['短视频', '剪辑', '病毒视频']
  },
  {
    name: 'Munch',
    description: 'AI 自动将长视频转换成多个社交短视频。',
    link: 'https://www.getmunch.com',
    category: '视频生成',
    tags: ['短视频', '社媒', '自动化']
  },
  {
    name: 'Klap',
    description: '一键将 YouTube 视频转换成 TikTok 格式短视频。',
    link: 'https://klap.app',
    category: '视频生成',
    tags: ['短视频', 'TikTok', '自动化']
  },
  {
    name: 'Captions',
    description: 'AI 视频编辑应用，自动生成字幕和特效。',
    link: 'https://www.captions.ai',
    category: '视频生成',
    tags: ['字幕', '视频', '移动应用']
  },
  {
    name: 'Runway ML',
    description: '创意 AI 工具套件，包括视频、图像和 3D。',
    link: 'https://runwayml.com',
    category: '视频生成',
    tags: ['创意', '套件', '多功能']
  },
  {
    name: 'Pictory',
    description: '将文字内容自动转换成视频。',
    link: 'https://pictory.ai',
    category: '视频生成',
    tags: ['文字转视频', '内容', '视频']
  },
  {
    name: 'InVideo AI',
    description: '文本生成视频，适合营销和社交媒体。',
    link: 'https://invideo.io',
    category: '视频生成',
    tags: ['文本转视频', '营销', '社媒']
  },
  {
    name: 'VEED.IO',
    description: '在线视频编辑工具，集成 AI 字幕和功能。',
    link: 'https://www.veed.io',
    category: '视频生成',
    tags: ['视频编辑', '字幕', '在线']
  },
  {
    name: 'Wisecut',
    description: 'AI 自动剪辑视频，删除停顿和错误。',
    link: 'https://www.wisecut.video',
    category: '视频生成',
    tags: ['自动剪辑', '视频', 'AI']
  },
  {
    name: 'Unscreen',
    description: 'AI 自动去除视频背景，无需绿幕。',
    link: 'https://www.unscreen.com',
    category: '视频生成',
    tags: ['背景去除', '视频', '无绿幕']
  },
  {
    name: 'Topaz Video AI',
    description: 'AI 视频增强工具，提升分辨率和质量。',
    link: 'https://www.topazlabs.com/topaz-video-ai',
    category: '视频生成',
    tags: ['视频增强', '画质', '专业']
  },
  {
    name: 'Pixop',
    description: '云端 AI 视频增强和修复平台。',
    link: 'https://pixop.com',
    category: '视频生成',
    tags: ['视频增强', '云端', '修复']
  },
  {
    name: 'Augie Studio',
    description: 'AI 视频广告制作平台，快速创建营销视频。',
    link: 'https://augie.studio',
    category: '视频生成',
    tags: ['广告', '营销', '视频']
  }
];

async function seedTools() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 连接成功');

    // 查找或创建默认用户
    let defaultUser = await User.findOne({ email: 'admin@qiangdekepa.com' });
    if (!defaultUser) {
      defaultUser = new User({
        username: '强的可怕团队',
        email: 'admin@qiangdekepa.com',
        password: 'Admin123!',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      });
      await defaultUser.save();
      console.log('创建默认用户成功');
    }

    // 清空现有工具
    await Tool.deleteMany({});
    console.log('清空现有工具数据');

    // 插入新工具
    const toolsWithAuthor = toolsData.map(tool => ({
      ...tool,
      author: defaultUser._id,
      views: Math.floor(Math.random() * 200) + 50,
      likes: [],
      commentsCount: 0
    }));

    await Tool.insertMany(toolsWithAuthor);
    console.log(`✅ 成功导入 ${toolsData.length} 个 AI 工具到 MongoDB Atlas`);

    await mongoose.disconnect();
    console.log('数据库连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('导入失败:', error);
    process.exit(1);
  }
}

seedTools();
