import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const tips = [
  '舌诊是中医四诊之一，有着数千年历史',
  '舌头的颜色可以反映气血状况',
  '舌苔的厚薄与脾胃功能密切相关',
  '中医认为"舌为心之苗"',
  '舌边的齿痕往往提示脾虚湿盛',
  '保持规律作息有助于改善体质',
];

export default function AnalyzingPage({ image }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col items-center justify-center p-6">
      {/* Image Preview */}
      {image && (
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg mb-8">
          <img
            src={image}
            alt="舌头照片"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Loading Animation */}
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-emerald-100 rounded-full" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Status Text */}
      <h2 className="text-xl font-semibold text-gray-900 mb-2">AI 正在分析</h2>
      <p className="text-gray-500 mb-8">请稍候，这可能需要几秒钟...</p>

      {/* Tips Carousel */}
      <div className="bg-white rounded-2xl p-4 shadow-sm max-w-sm w-full">
        <p className="text-xs text-emerald-600 font-medium mb-1">小知识</p>
        <p className="text-sm text-gray-600 transition-opacity duration-300">
          {tips[tipIndex]}
        </p>
      </div>
    </div>
  );
}
