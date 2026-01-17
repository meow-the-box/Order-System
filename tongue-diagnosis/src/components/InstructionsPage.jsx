import { ArrowLeft, Camera, Cpu, BookOpen, Shield } from 'lucide-react';

export default function InstructionsPage({ onBack }) {
  const sections = [
    {
      icon: Camera,
      title: '如何拍照',
      color: 'bg-blue-100 text-blue-600',
      items: [
        '选择光线充足的环境，自然光最佳',
        '张开嘴巴，自然伸出舌头',
        '舌尖轻微向下，舌面保持平展',
        '手机距离舌头约 20-30 厘米',
        '确保舌头完整入镜，避免模糊',
      ],
    },
    {
      icon: Cpu,
      title: 'AI 分析说明',
      color: 'bg-purple-100 text-purple-600',
      items: [
        'AI 会分析舌色、舌形、舌苔等特征',
        '根据中医理论判断体质类型',
        '提供个性化的调理建议',
        '分析结果仅供参考，不作为诊断依据',
      ],
    },
    {
      icon: BookOpen,
      title: '九种体质',
      color: 'bg-emerald-100 text-emerald-600',
      items: [
        '平和质 - 阴阳调和，身体健康',
        '气虚质 - 元气不足，容易疲劳',
        '阳虚质 - 阳气不足，畏寒怕冷',
        '阴虚质 - 阴液亏少，口干咽燥',
        '痰湿质 - 痰湿凝聚，体形肥胖',
        '湿热质 - 湿热内蕴，面垢油光',
        '血瘀质 - 血行不畅，肤色晦暗',
        '气郁质 - 气机郁滞，情绪抑郁',
        '特禀质 - 先天禀赋不足，易过敏',
      ],
    },
    {
      icon: Shield,
      title: '隐私保护',
      color: 'bg-amber-100 text-amber-600',
      items: [
        '所有数据仅存储在您的设备上',
        '照片不会上传到任何服务器保存',
        '分析完成后图片仅用于本地展示',
        '您可以随时删除历史记录',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">使用说明</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-8">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 ${section.color} rounded-xl flex items-center justify-center`}
                >
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="text-emerald-500 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Version Info */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>中医智能舌诊助手 v1.0</p>
          <p className="mt-1">Powered by AI</p>
        </div>
      </main>
    </div>
  );
}
