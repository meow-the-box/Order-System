# 中医智能舌诊助手 - Product Spec (v3.0)

## 项目概述

**项目名称**: 中医智能舌诊助手
**目标**: 拍照分析舌象，判断体质，提供调理建议
**用户**: 任何人，通过链接即可使用
**费用**: **完全免费**

---

## 技术方案

```
┌─────────────────────────────────────────────────────────┐
│                    用户手机浏览器                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│  │  拍照    │ → │  分析中  │ → │  结果    │             │
│  └─────────┘    └────┬────┘    └─────────┘             │
└──────────────────────┼──────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Vercel Serverless Function                  │
│                  (API 代理，保护密钥)                      │
└──────────────────────┼───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│              Google Gemini API (免费)                     │
│                  分析图片，返回结果                        │
└──────────────────────────────────────────────────────────┘
```

### 费用明细

| 项目 | 方案 | 费用 |
|------|------|------|
| 前端托管 | Vercel | 免费 |
| 后端 API | Vercel Serverless | 免费 |
| AI 分析 | Google Gemini API | 免费 (1500次/天) |
| 域名 | xxx.vercel.app | 免费 |
| 数据存储 | 浏览器 localStorage | 免费 |
| **总计** | | **$0** |

---

## 一、核心功能

### 1. 拍照与上传
- 调用手机摄像头拍摄舌头照片
- 支持从相册选择照片
- **舌头形状引导框**辅助对准
- 图片自动压缩（最大 1024px，质量 80%）

### 2. AI 分析（全自动）
- 使用 Google Gemini 1.5 Flash（免费）
- 分析维度：
  - 舌色（淡白/淡红/红/绛/青紫）
  - 舌形（胖大/正常/瘦小、齿痕、裂纹）
  - 舌苔颜色（白/黄/灰/黑）
  - 舌苔厚薄（薄/厚）
  - 舌苔性质（润/燥/腻/腐）
  - 体质类型（九种体质）

### 3. 结果展示
- 舌象特征标签化展示
- 体质类型判断（带可信度）
- 调理建议：
  - 饮食建议
  - 生活方式
  - 穴位按摩
- 医疗免责声明

### 4. 历史记录
- 本地存储（浏览器 localStorage）
- 最多保存 20 条记录
- 按时间倒序展示
- 支持查看详情、删除

### 5. 用户引导
- 首次使用欢迎页
- 拍照指导说明
- 使用说明

---

## 二、技术架构

### 2.1 前端
```
框架: React 18
构建: Vite
样式: Tailwind CSS
图标: Lucide React
路由: React Router (可选，或用状态管理)
```

### 2.2 后端（Vercel Serverless）
```
运行时: Node.js 18
作用: 代理 Gemini API，保护 API Key
路径: /api/analyze
```

### 2.3 AI 模型
```
提供商: Google
模型: gemini-1.5-flash
输入: 图片 base64 + 提示词
输出: JSON 格式分析结果
免费额度: 15次/分钟，1500次/天
```

### 2.4 数据存储
```
方案: localStorage
用途:
  - 首次访问标记
  - 历史记录列表
  - 分析详情
限制:
  - 约 5MB 容量
  - 仅限当前浏览器
  - 清除浏览器数据会丢失
```

---

## 三、项目结构

```
tongue-diagnosis/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── WelcomePage.jsx      # 欢迎页
│   │   ├── HomePage.jsx         # 主页
│   │   ├── GuidePage.jsx        # 拍照指导
│   │   ├── CameraPage.jsx       # 拍照界面
│   │   ├── AnalyzingPage.jsx    # 分析中
│   │   ├── ResultPage.jsx       # 结果页
│   │   ├── HistoryPage.jsx      # 历史记录
│   │   └── InstructionsPage.jsx # 使用说明
│   ├── utils/
│   │   ├── imageCompress.js     # 图片压缩
│   │   ├── storage.js           # localStorage 封装
│   │   └── api.js               # API 调用
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── api/
│   └── analyze.js               # Vercel Serverless Function
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
└── .env.local                   # 本地开发环境变量
```

---

## 四、核心代码

### 4.1 图片压缩
```javascript
// src/utils/imageCompress.js
export const compressImage = (file, maxSize = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // 按比例缩放
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // 返回 base64（不含前缀）
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
```

### 4.2 API 调用
```javascript
// src/utils/api.js
export const analyzeTongue = async (imageBase64) => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64 }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '分析失败');
  }

  return response.json();
};
```

### 4.3 Vercel Serverless Function
```javascript
// api/analyze.js
export const config = {
  maxDuration: 30,
};

const PROMPT = `你是一位专业的中医舌诊专家。请仔细观察这张舌头照片，根据中医舌诊理论进行分析。

请按以下维度分析：
1. 舌色：淡白/淡红/红/绛/青紫
2. 舌形：胖大/正常/瘦小，是否有齿痕/裂纹
3. 舌苔颜色：白/黄/灰/黑
4. 舌苔厚薄：薄/厚
5. 舌苔性质：润/燥/腻/腐
6. 判断最可能的体质类型（平和质/气虚质/阳虚质/阴虚质/痰湿质/湿热质/血瘀质/气郁质/特禀质）
7. 给出饮食、生活方式、穴位按摩建议

请只返回 JSON 格式，不要其他文字：
{
  "tongueColor": "舌色",
  "tongueShape": "舌形",
  "hasTeethMarks": true或false,
  "hasCracks": true或false,
  "coatingColor": "苔色",
  "coatingThickness": "薄或厚",
  "coatingTexture": "润/燥/腻/腐",
  "constitution": "体质类型",
  "confidence": "高/中等/低",
  "features": ["特征1", "特征2", "特征3"],
  "healthStatus": "简短的健康状态描述",
  "recommendations": {
    "diet": ["食物1", "食物2", "食物3", "食物4"],
    "lifestyle": ["建议1", "建议2", "建议3"],
    "acupoints": ["穴位1", "穴位2", "穴位3"]
  }
}`;

export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '只支持 POST 请求' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ message: '缺少图片数据' });
  }

  try {
    // 提取 base64 数据（去掉前缀）
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // 调用 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data,
                  },
                },
                {
                  text: PROMPT,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API Error:', error);
      return res.status(500).json({ message: 'AI 分析失败，请稍后重试' });
    }

    const data = await response.json();

    // 提取文本内容
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(500).json({ message: '未能获取分析结果' });
    }

    // 解析 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ message: '结果解析失败' });
    }

    const result = JSON.parse(jsonMatch[0]);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
}
```

### 4.4 localStorage 封装
```javascript
// src/utils/storage.js
const KEYS = {
  WELCOME_SEEN: 'tongue_welcome_seen',
  HISTORY_LIST: 'tongue_history_list',
  DETAIL_PREFIX: 'tongue_detail_',
};

// 检查是否首次访问
export const isFirstVisit = () => {
  return !localStorage.getItem(KEYS.WELCOME_SEEN);
};

// 标记已访问
export const markVisited = () => {
  localStorage.setItem(KEYS.WELCOME_SEEN, 'true');
};

// 获取历史列表
export const getHistoryList = () => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY_LIST);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// 保存分析结果
export const saveAnalysis = (analysis, imageBase64) => {
  const id = `t_${Date.now()}`;
  const timestamp = new Date().toISOString();

  // 保存详情（含压缩后的图片缩略图）
  const detail = {
    ...analysis,
    image: imageBase64,
    timestamp,
  };
  localStorage.setItem(`${KEYS.DETAIL_PREFIX}${id}`, JSON.stringify(detail));

  // 更新列表
  const list = getHistoryList();
  const newRecord = {
    id,
    date: timestamp.split('T')[0],
    constitution: analysis.constitution,
  };
  const updatedList = [newRecord, ...list].slice(0, 20);
  localStorage.setItem(KEYS.HISTORY_LIST, JSON.stringify(updatedList));

  return id;
};

// 获取分析详情
export const getAnalysisDetail = (id) => {
  try {
    const data = localStorage.getItem(`${KEYS.DETAIL_PREFIX}${id}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// 删除记录
export const deleteAnalysis = (id) => {
  localStorage.removeItem(`${KEYS.DETAIL_PREFIX}${id}`);
  const list = getHistoryList().filter((item) => item.id !== id);
  localStorage.setItem(KEYS.HISTORY_LIST, JSON.stringify(list));
};
```

---

## 五、页面设计

### 5.1 页面流程
```
welcome (欢迎页，首次访问显示)
  ↓
home (主页)
  ├─→ guide (拍照指导) → camera (拍照) → analyzing (分析中) → result (结果)
  ├─→ history (历史记录) → result (历史详情)
  └─→ instructions (使用说明)
```

### 5.2 主要页面

#### 欢迎页
- 产品介绍
- 免责声明
- "开始使用"按钮

#### 主页
- Logo + 标题
- "开始舌诊"大按钮
- "历史记录"入口
- "使用说明"入口

#### 拍照指导页
- 光线要求：自然光最佳
- 姿势要求：张口伸舌，舌体放松
- 距离要求：20-30cm
- "开始拍照"按钮

#### 拍照页
- 全屏相机预览
- **舌头形状引导框**（椭圆虚线）
- 拍照按钮
- 相册选择按钮

#### 分析中页
- 加载动画
- "AI 正在分析您的舌象..."
- 分析小贴士轮播

#### 结果页
- 舌头照片缩略图
- 舌象特征标签（舌色、舌形、舌苔等）
- 体质类型卡片（大字显示）
- 调理建议分类展示
- 免责声明
- "保存到历史"按钮
- "重新分析"按钮

#### 历史记录页
- 记录列表（日期 + 体质类型）
- 点击查看详情
- 左滑删除

---

## 六、舌头引导框

```jsx
// 拍照页的引导框组件
const TongueGuide = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
    {/* 半透明遮罩 */}
    <defs>
      <mask id="tongueMask">
        <rect width="100" height="100" fill="white" />
        <ellipse cx="50" cy="50" rx="25" ry="35" fill="black" />
      </mask>
    </defs>
    <rect width="100" height="100" fill="rgba(0,0,0,0.5)" mask="url(#tongueMask)" />

    {/* 引导框 */}
    <ellipse
      cx="50"
      cy="50"
      rx="25"
      ry="35"
      fill="none"
      stroke="white"
      strokeWidth="0.5"
      strokeDasharray="2,1"
      className="animate-pulse"
    />

    {/* 提示文字 */}
    <text x="50" y="90" textAnchor="middle" fill="white" fontSize="4">
      将舌头对准框内
    </text>
  </svg>
);
```

---

## 七、设计规范

### 色彩
```css
主色: #10B981 (emerald-500) - 健康、中医
辅色: #3B82F6 (blue-500) - 科技感
背景: #F9FAFB (gray-50)
文字: #111827 (gray-900)

/* 体质颜色 */
平和质: emerald
气虚质: yellow
阳虚质: blue
阴虚质: red
痰湿质: purple
湿热质: orange
血瘀质: indigo
气郁质: pink
特禀质: gray
```

### 字体
```css
标题: text-2xl font-bold
副标题: text-xl font-semibold
正文: text-base
小字: text-sm
说明: text-xs text-gray-500
```

### 圆角
```css
按钮: rounded-xl (12px)
卡片: rounded-2xl (16px)
标签: rounded-full
```

---

## 八、部署步骤

### 1. 获取 Gemini API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)
2. 登录 Google 账号
3. 点击 "Get API Key"
4. 创建新的 API Key
5. 复制保存

### 2. 部署到 Vercel
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 设置环境变量
vercel env add GEMINI_API_KEY
# 粘贴你的 API Key

# 5. 重新部署
vercel --prod
```

### 3. 访问
部署完成后会得到一个链接：
```
https://your-project.vercel.app
```

分享这个链接，任何人都可以使用！

---

## 九、配置文件

### package.json
```json
{
  "name": "tongue-diagnosis",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0"
  }
}
```

### vite.config.js
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### tailwind.config.js
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## 十、注意事项

### 安全
- API Key 只存在服务端，用户看不到
- 不收集用户数据，全部存在用户本地

### 限制
- Gemini 免费额度：15次/分钟，1500次/天
- 超过限制会返回错误，提示用户稍后再试
- localStorage 约 5MB，足够存 20 条记录

### 免责
- 每个结果页必须显示医疗免责声明
- 欢迎页需要用户确认知晓

---

## 十一、开发检查清单

### Phase 1: 项目搭建
- [ ] 初始化 Vite + React 项目
- [ ] 配置 Tailwind CSS
- [ ] 安装 Lucide React

### Phase 2: 页面开发
- [ ] 欢迎页
- [ ] 主页
- [ ] 拍照指导页
- [ ] 拍照页（含引导框）
- [ ] 分析中页
- [ ] 结果页
- [ ] 历史记录页
- [ ] 使用说明页

### Phase 3: 功能开发
- [ ] 图片压缩
- [ ] localStorage 封装
- [ ] API 调用

### Phase 4: 后端开发
- [ ] Vercel Serverless Function
- [ ] Gemini API 集成
- [ ] 错误处理

### Phase 5: 部署
- [ ] 获取 Gemini API Key
- [ ] 部署到 Vercel
- [ ] 配置环境变量
- [ ] 测试完整流程

---

**文档版本**: v3.0
**最后更新**: 2026年1月17日
**方案**: Vercel + Google Gemini (完全免费)
