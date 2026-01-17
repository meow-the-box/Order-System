# 中医智能舌诊助手

AI 驱动的中医舌诊分析工具，拍照即可获取体质分析和调理建议。

## 功能特点

- 📸 拍照或选择照片进行舌诊分析
- 🤖 AI 智能分析舌象特征
- 📊 判断九种体质类型
- 💡 提供个性化调理建议
- 📝 本地保存历史记录
- 🔒 隐私保护，数据仅存设备本地

## 技术栈

- **前端**: React 18 + Vite + Tailwind CSS
- **后端**: Vercel Serverless Functions
- **AI**: Google Gemini 1.5 Flash
- **存储**: localStorage

## 快速开始

### 1. 获取 Gemini API Key

1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录 Google 账号
3. 点击 "Get API Key"
4. 创建并复制 API Key

### 2. 本地开发

```bash
# 进入项目目录
cd tongue-diagnosis

# 安装依赖
npm install

# 创建环境变量文件
cp .env.example .env.local

# 编辑 .env.local，填入你的 API Key
# GEMINI_API_KEY=your_api_key_here

# 启动开发服务器
npm run dev
```

### 3. 部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 设置环境变量
vercel env add GEMINI_API_KEY
# 输入你的 API Key

# 生产部署
vercel --prod
```

部署完成后，你会得到一个 `https://your-project.vercel.app` 链接。

## 项目结构

```
tongue-diagnosis/
├── api/
│   └── analyze.js          # Vercel Serverless API
├── src/
│   ├── components/         # React 组件
│   │   ├── WelcomePage.jsx
│   │   ├── HomePage.jsx
│   │   ├── GuidePage.jsx
│   │   ├── CameraPage.jsx
│   │   ├── AnalyzingPage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── HistoryPage.jsx
│   │   └── InstructionsPage.jsx
│   ├── utils/              # 工具函数
│   │   ├── api.js
│   │   ├── constitution.js
│   │   ├── imageCompress.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

## 使用限制

- Gemini API 免费额度：15 次/分钟，1500 次/天
- localStorage 存储限制：约 5MB
- 历史记录最多保存 20 条

## 免责声明

本工具仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询专业医师。

## License

MIT
