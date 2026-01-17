# 中医智能舌诊助手 - Product Spec (修订版)

## 修订说明

> **原规格问题与修正**：
> 1. ~~直接调用 Claude API~~ → Claude Artifact **无法发送外部网络请求**，改为**两阶段工作流**
> 2. ~~API 密钥硬编码~~ → 不再需要，分析由 Claude 对话完成
> 3. 确认 `window.storage` 为 Artifact 环境专用 API
> 4. 简化技术复杂度，聚焦可行方案

---

## 项目概述

**项目名称**: 中医智能舌诊助手
**部署环境**: Claude Artifact (需要 Claude Pro 订阅)
**技术栈**: React + Tailwind CSS + window.storage
**工作模式**: Artifact UI + Claude 对话分析（两阶段工作流）

### 两阶段工作流说明

```
┌─────────────────────────────────────────────────────────────┐
│                     Artifact 应用                           │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ 拍照指导 │ → │ 拍照/选图 │ → │ 照片预览 │ → │ 导出图片 │  │
│  └─────────┘    └─────────┘    └─────────┘    └────┬────┘  │
│                                                     │       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐         │       │
│  │ 历史记录 │ ← │ 保存结果 │ ← │ 输入结果 │ ←───────┼───┐   │
│  └─────────┘    └─────────┘    └─────────┘         │   │   │
└─────────────────────────────────────────────────────┼───┼───┘
                                                      │   │
                    ┌─────────────────────────────────┼───┼───┐
                    │         Claude 对话              │   │   │
                    │                                  ▼   │   │
                    │  用户发送照片 → Claude 分析 → 返回结果  │
                    │                                  ↑   │   │
                    │                                  └───┘   │
                    └──────────────────────────────────────────┘
```

**用户操作流程**：
1. 在 Artifact 中查看拍照指导
2. 拍照或选择舌头照片
3. 将照片发送到 Claude 对话（长按保存/分享）
4. Claude 自动分析并返回 JSON 结果
5. 在 Artifact 中输入/粘贴结果并保存
6. 查看历史记录和趋势

---

## 一、核心功能

### 1. 拍照与上传
- 调用设备摄像头拍摄舌头照片
- 支持从相册选择照片
- 舌头形状引导框辅助对准
- 图片自动压缩（最大 1024px，质量 85%）
- **导出照片功能**（方便发送到 Claude 对话）

### 2. AI 分析（在 Claude 对话中完成）
- 用户将照片发送到 Claude 对话
- Claude 根据预设提示词分析舌象
- 返回结构化 JSON 结果
- **Artifact 提供"复制分析提示词"按钮**

### 3. 结果录入与展示
- 提供结果输入界面（粘贴 JSON 或手动选择）
- 舌象特征标签化展示
- 体质类型判断（带可信度）
- 分类调理建议：
  - 饮食建议
  - 生活方式
  - 穴位按摩
- 医疗免责声明

### 4. 历史记录
- 本地存储分析历史（最多 20 条）
- 按时间倒序展示
- 支持查看详情
- 支持删除记录
- 支持导出记录

### 5. 用户引导
- 首次使用欢迎页
- 拍照指导说明（光线、角度、距离）
- 使用流程说明（含截图示意）
- **分析提示词模板**

---

## 二、技术架构

### 2.1 前端技术
```
框架: React (函数组件 + Hooks)
样式: Tailwind CSS (Artifact 内置支持)
图标: Lucide React (Artifact 内置支持)
状态管理: React useState/useEffect
```

### 2.2 数据存储
```
方案: window.storage (Claude Artifact 持久化 API)
用途:
  - 欢迎页已读标记
  - 历史记录列表
  - 分析详情数据
限制:
  - 仅文本/JSON（不存储图片 base64，太大）
  - 单个 key 最大 5MB
  - 需要 try-catch 错误处理
```

### 2.3 AI 分析（在 Claude 对话中）
```
模型: Claude (通过对话界面)
输入: 用户发送图片 + 预设提示词
输出: JSON 格式分析结果
提示词: Artifact 提供复制按钮
```

### 2.4 数据结构

#### 历史记录列表
```json
Key: "tongue_history_list"
Value: [
  {
    "id": "t_1737123456789",
    "date": "2026-01-17",
    "constitution": "痰湿质",
    "confidence": "中等"
  }
]
```

#### 分析详情
```json
Key: "tongue_detail_t_1737123456789"
Value: {
  "tongueColor": "淡白",
  "tongueShape": "胖大",
  "hasTeethMarks": true,
  "hasCracks": false,
  "coatingColor": "白",
  "coatingThickness": "厚",
  "coatingTexture": "腻",
  "constitution": "痰湿质",
  "confidence": "中等",
  "features": ["舌体胖大", "舌边齿痕", "苔白厚腻"],
  "healthStatus": "脾虚湿盛，可能容易疲劳，痰多",
  "recommendations": {
    "diet": ["薏米", "红小豆", "冬瓜", "茯苓"],
    "lifestyle": ["加强有氧运动", "保持环境干燥", "避免久坐"],
    "acupoints": ["丰隆穴", "阴陵泉", "足三里"]
  },
  "timestamp": "2026-01-17T12:00:00.000Z"
}
```

**注意**：不存储图片 base64，避免存储空间耗尽。

---

## 三、页面流程

### 3.1 页面结构
```
welcome (欢迎页)
  ↓
home (主页)
  ├─→ guide (拍照指导)
  │     ↓
  │   camera (拍照界面)
  │     ↓
  │   preview (照片预览 + 导出提示)
  │
  ├─→ input (结果录入页) ← 新增
  │     ↓
  │   result (结果展示)
  │
  ├─→ history (历史记录)
  │     ↓
  │   result (历史详情)
  │
  ├─→ prompt (提示词复制页) ← 新增
  │
  └─→ instructions (使用说明)
```

### 3.2 状态管理
```javascript
const [currentPage, setCurrentPage] = useState('welcome');
const [capturedImage, setCapturedImage] = useState(null);
const [analysisResult, setAnalysisResult] = useState(null);
const [historyList, setHistoryList] = useState([]);
const [isFirstVisit, setIsFirstVisit] = useState(true);
```

---

## 四、核心代码实现

### 4.1 图片压缩（保留）
```javascript
const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        const max = 1024;

        if (w > h && w > max) {
          h = (h * max) / w;
          w = max;
        } else if (h > max) {
          w = (w * max) / h;
          h = max;
        }

        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
```

### 4.2 分析提示词模板
```javascript
const ANALYSIS_PROMPT = `你是一位专业的中医舌诊专家。请仔细观察这张舌头照片，根据中医舌诊理论进行分析。

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
  "hasTeethMarks": true/false,
  "hasCracks": true/false,
  "coatingColor": "苔色",
  "coatingThickness": "薄/厚",
  "coatingTexture": "润/燥/腻/腐",
  "constitution": "体质类型",
  "confidence": "高/中等/低",
  "features": ["特征1", "特征2"],
  "healthStatus": "健康状态描述",
  "recommendations": {
    "diet": ["食物1", "食物2"],
    "lifestyle": ["建议1", "建议2"],
    "acupoints": ["穴位1", "穴位2"]
  }
}`;

// 复制提示词功能
const copyPrompt = async () => {
  try {
    await navigator.clipboard.writeText(ANALYSIS_PROMPT);
    alert('提示词已复制！请发送照片到 Claude 对话，然后粘贴此提示词。');
  } catch {
    // Fallback: 显示提示词让用户手动复制
    setShowPromptModal(true);
  }
};
```

### 4.3 结果录入与解析
```javascript
// 解析用户输入的 JSON 结果
const parseAnalysisResult = (input) => {
  try {
    // 尝试提取 JSON
    const jsonMatch = input.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);

      // 验证必需字段
      const requiredFields = ['tongueColor', 'constitution'];
      const hasRequired = requiredFields.every(field => result[field]);

      if (!hasRequired) {
        throw new Error('缺少必需字段');
      }

      return { success: true, data: result };
    }
    throw new Error('未找到有效 JSON');
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 手动选择模式（备选方案）
const ManualInputForm = () => {
  const [formData, setFormData] = useState({
    tongueColor: '',
    tongueShape: '',
    hasTeethMarks: false,
    hasCracks: false,
    coatingColor: '',
    coatingThickness: '',
    coatingTexture: '',
    constitution: '',
  });

  // ... 表单 UI
};
```

### 4.4 持久化存储（修正版）
```javascript
// 存储键名常量
const STORAGE_KEYS = {
  HISTORY_LIST: 'tongue_history_list',
  DETAIL_PREFIX: 'tongue_detail_',
  WELCOME_SEEN: 'tongue_welcome_seen',
};

// 保存分析结果
const saveToHistory = async (analysis) => {
  const id = `t_${Date.now()}`;

  try {
    // 保存详细信息（不含图片）
    await window.storage.set(
      `${STORAGE_KEYS.DETAIL_PREFIX}${id}`,
      JSON.stringify({
        ...analysis,
        timestamp: new Date().toISOString()
      })
    );

    // 更新列表
    const newRecord = {
      id,
      date: new Date().toISOString().split('T')[0],
      constitution: analysis.constitution,
      confidence: analysis.confidence || '未知'
    };

    const updatedHistory = [newRecord, ...historyList].slice(0, 20);
    setHistoryList(updatedHistory);

    await window.storage.set(
      STORAGE_KEYS.HISTORY_LIST,
      JSON.stringify(updatedHistory)
    );

    return { success: true, id };
  } catch (error) {
    console.error('保存失败:', error);
    return { success: false, error: error.message };
  }
};

// 加载历史记录
const loadHistory = async () => {
  try {
    const result = await window.storage.get(STORAGE_KEYS.HISTORY_LIST);
    if (result && result.value) {
      setHistoryList(JSON.parse(result.value));
    }
  } catch (error) {
    console.error('加载历史失败:', error);
    setHistoryList([]);
  }
};

// 删除记录
const deleteHistory = async (id) => {
  try {
    await window.storage.delete(`${STORAGE_KEYS.DETAIL_PREFIX}${id}`);
    const updatedHistory = historyList.filter(item => item.id !== id);
    setHistoryList(updatedHistory);
    await window.storage.set(
      STORAGE_KEYS.HISTORY_LIST,
      JSON.stringify(updatedHistory)
    );
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 查看历史详情
const viewHistoryDetail = async (id) => {
  try {
    const result = await window.storage.get(`${STORAGE_KEYS.DETAIL_PREFIX}${id}`);
    if (result && result.value) {
      const data = JSON.parse(result.value);
      setAnalysisResult(data);
      setCurrentPage('result');
      return { success: true };
    }
    throw new Error('记录不存在');
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 五、新增页面设计

### 5.1 照片预览页（增强版）
```jsx
const PreviewPage = () => (
  <div className="flex flex-col h-full">
    <header className="p-4 text-center">
      <h1 className="text-xl font-bold">照片预览</h1>
    </header>

    <main className="flex-1 p-4">
      <img
        src={capturedImage}
        alt="舌头照片"
        className="w-full rounded-xl"
      />

      {/* 操作提示 */}
      <div className="mt-4 p-4 bg-amber-50 rounded-xl">
        <p className="text-amber-800 text-sm">
          <strong>下一步：</strong>
        </p>
        <ol className="text-amber-700 text-sm mt-2 space-y-1">
          <li>1. 长按上方图片，保存到相册</li>
          <li>2. 返回 Claude 对话，发送照片</li>
          <li>3. 复制下方提示词，粘贴发送</li>
          <li>4. 收到分析结果后，点击"录入结果"</li>
        </ol>
      </div>
    </main>

    <footer className="p-4 space-y-3">
      <button
        onClick={copyPrompt}
        className="w-full py-3 bg-emerald-500 text-white rounded-xl"
      >
        复制分析提示词
      </button>
      <button
        onClick={() => setCurrentPage('input')}
        className="w-full py-3 bg-blue-500 text-white rounded-xl"
      >
        录入分析结果
      </button>
      <button
        onClick={() => setCurrentPage('camera')}
        className="w-full py-3 border border-gray-300 rounded-xl"
      >
        重新拍照
      </button>
    </footer>
  </div>
);
```

### 5.2 结果录入页（新增）
```jsx
const InputPage = () => {
  const [inputText, setInputText] = useState('');
  const [parseError, setParseError] = useState(null);
  const [inputMode, setInputMode] = useState('json'); // 'json' | 'manual'

  const handleSubmit = () => {
    if (inputMode === 'json') {
      const result = parseAnalysisResult(inputText);
      if (result.success) {
        setAnalysisResult(result.data);
        setCurrentPage('result');
      } else {
        setParseError(result.error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4">
        <button onClick={() => setCurrentPage('preview')}>返回</button>
        <h1 className="text-xl font-bold text-center">录入分析结果</h1>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        {/* 切换输入模式 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('json')}
            className={`flex-1 py-2 rounded-lg ${
              inputMode === 'json'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            粘贴 JSON
          </button>
          <button
            onClick={() => setInputMode('manual')}
            className={`flex-1 py-2 rounded-lg ${
              inputMode === 'manual'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            手动填写
          </button>
        </div>

        {inputMode === 'json' ? (
          <>
            <p className="text-sm text-gray-600 mb-2">
              将 Claude 返回的 JSON 结果粘贴到下方：
            </p>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setParseError(null);
              }}
              placeholder='{"tongueColor": "淡红", ...}'
              className="w-full h-48 p-3 border rounded-xl text-sm font-mono"
            />
            {parseError && (
              <p className="text-red-500 text-sm mt-2">
                解析错误：{parseError}
              </p>
            )}
          </>
        ) : (
          <ManualInputForm
            onSubmit={(data) => {
              setAnalysisResult(data);
              setCurrentPage('result');
            }}
          />
        )}
      </main>

      {inputMode === 'json' && (
        <footer className="p-4">
          <button
            onClick={handleSubmit}
            disabled={!inputText.trim()}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl disabled:opacity-50"
          >
            解析并查看结果
          </button>
        </footer>
      )}
    </div>
  );
};
```

---

## 六、设计规范（保持原有）

### 6.1 色彩系统
```css
/* 主色 */
--primary: #10B981 (emerald-500)
--secondary: #3B82F6 (blue-500)

/* 体质颜色映射 */
平和质: bg-green-100 text-green-700
气虚质: bg-yellow-100 text-yellow-700
阳虚质: bg-blue-100 text-blue-700
阴虚质: bg-red-100 text-red-700
痰湿质: bg-purple-100 text-purple-700
湿热质: bg-orange-100 text-orange-700
血瘀质: bg-indigo-100 text-indigo-700
气郁质: bg-pink-100 text-pink-700
特禀质: bg-gray-100 text-gray-700
```

### 6.2 字体与间距（保持原有）
参见原文档第五章。

---

## 七、舌头引导框设计（保持原有）

参见原文档第六章。

---

## 八、中医知识库（保持原有）

参见原文档第七章。

---

## 九、关键注意事项（更新版）

### 9.1 Artifact 环境限制
```
❌ 禁止：
- 外部 API 调用（fetch 到外部域名）
- localStorage / sessionStorage
- 第三方 CDN 资源

✅ 可用：
- window.storage（Artifact 专用）
- React 内置功能
- Tailwind CSS（内置）
- Lucide React（内置）
- navigator.clipboard（剪贴板）
- 设备摄像头（通过 input type="file"）
```

### 9.2 用户体验优化
- 清晰的步骤引导（两阶段工作流）
- 提示词一键复制
- JSON 解析容错（自动提取 {} 内容）
- 手动输入备选方案
- 历史记录不存储图片（节省空间）

### 9.3 医疗免责
**每个分析结果必须包含**：
- "本分析仅供参考，不能替代专业医疗诊断"
- 首次使用显示完整免责声明
- 结果页底部显示免责提示

---

## 十、开发检查清单（更新版）

### Phase 1: 基础框架
- [ ] React 组件结构搭建
- [ ] 页面状态管理
- [ ] Tailwind CSS 样式
- [ ] Lucide React 图标

### Phase 2: 拍照功能
- [ ] 文件选择器（相机/相册）
- [ ] 舌头引导框 SVG
- [ ] 图片压缩算法
- [ ] 照片预览界面
- [ ] 图片长按保存提示

### Phase 3: 结果录入（新增）
- [ ] JSON 粘贴输入
- [ ] JSON 解析与验证
- [ ] 手动填写表单
- [ ] 表单验证

### Phase 4: 分析提示词
- [ ] 提示词模板定义
- [ ] 一键复制功能
- [ ] 复制失败时显示弹窗

### Phase 5: 结果展示
- [ ] 舌象特征卡片
- [ ] 体质类型判断
- [ ] 调理建议分类
- [ ] 免责声明展示
- [ ] 保存到历史按钮

### Phase 6: 数据持久化
- [ ] window.storage 封装
- [ ] 历史记录保存
- [ ] 历史记录读取
- [ ] 删除功能实现

### Phase 7: 用户引导
- [ ] 欢迎页设计
- [ ] 拍照指导页
- [ ] 使用说明页（含两阶段流程）
- [ ] 首次使用标记

### Phase 8: 测试
- [ ] Artifact 环境测试
- [ ] window.storage 测试
- [ ] 图片拍摄测试
- [ ] JSON 解析测试
- [ ] 错误处理测试

---

## 十一、使用说明（用户视角）

### 快速开始

1. **准备拍照**
   - 找一个光线充足的地方
   - 自然光最佳，避免强烈灯光

2. **拍摄舌头**
   - 点击"开始舌诊"
   - 查看拍照指导
   - 张口伸舌，对准引导框
   - 拍摄或从相册选择

3. **发送到 Claude**
   - 长按照片，保存到相册
   - 返回 Claude 对话
   - 发送照片
   - 复制提示词，粘贴发送

4. **录入结果**
   - 等待 Claude 返回分析结果
   - 复制 JSON 结果
   - 返回 Artifact，点击"录入结果"
   - 粘贴 JSON，点击解析

5. **查看与保存**
   - 查看舌象分析和调理建议
   - 点击"保存到历史"
   - 随时在历史记录中查看

---

## 十二、常见问题

### Q: 为什么不能直接在 App 内分析？
A: Claude Artifact 环境出于安全考虑，不允许调用外部 API。通过 Claude 对话分析是目前最简单可行的方案。

### Q: JSON 解析失败怎么办？
A: 可以切换到"手动填写"模式，根据 Claude 的文字描述手动选择各项特征。

### Q: 历史记录为什么没有保存图片？
A: 为了节省存储空间。每张图片 base64 编码后约 500KB-2MB，20 条记录会很快耗尽 5MB 限制。

### Q: 分析结果准确吗？
A: 本工具仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询专业中医师。

---

**文档版本**: v2.0
**最后更新**: 2026年1月17日
**修订者**: Claude
**基于原版本**: v1.0 by Claude AI Assistant

---

## 附录：与原规格的差异对照

| 原规格 | 修订版 | 原因 |
|-------|-------|------|
| 直接调用 Claude API | 两阶段工作流 | Artifact 无法发送外部请求 |
| 存储图片 base64 | 不存储图片 | 节省 window.storage 空间 |
| API 分析页面 | 结果录入页面 | 改为手动输入分析结果 |
| 单一流程 | 双流程（Artifact + 对话） | 适应环境限制 |
| package.json | 不需要 | Artifact 内置依赖 |
| 独立部署 | Artifact 部署 | 明确部署方式 |
