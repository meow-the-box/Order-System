import { Sun, Ruler, Eye, ArrowLeft, Camera } from 'lucide-react';

export default function GuidePage({ onBack, onStartCamera }) {
  const tips = [
    {
      icon: Sun,
      title: '光线充足',
      desc: '选择自然光或明亮的白色灯光，避免彩色灯光',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Ruler,
      title: '适当距离',
      desc: '手机距离舌头约 20-30 厘米，确保舌头完整入镜',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Eye,
      title: '舌体放松',
      desc: '自然伸出舌头，不要过度用力，保持舌面平展',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">拍照指导</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6">
        {/* Demo Image */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="aspect-[4/3] bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
            <div className="text-center">
              <span className="text-6xl">👅</span>
              <p className="text-gray-400 text-sm mt-2">示意图</p>
            </div>
          </div>
          <p className="text-center text-gray-600 text-sm">
            张开嘴巴，自然伸出舌头，舌尖轻微向下
          </p>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900">拍照要点</h2>
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 flex gap-4 shadow-sm"
            >
              <div className={`w-12 h-12 ${tip.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <tip.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{tip.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Button */}
      <div className="p-6 pb-8">
        <button
          onClick={onStartCamera}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <Camera className="w-5 h-5" />
          开始拍照
        </button>
      </div>
    </div>
  );
}
