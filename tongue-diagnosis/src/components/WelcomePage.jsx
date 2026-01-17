import { Sparkles, Shield, Clock, ChevronRight } from 'lucide-react';

export default function WelcomePage({ onStart }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <span className="text-5xl">👅</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">中医智能舌诊</h1>
        <p className="text-gray-500 mb-8">AI 分析舌象，了解体质</p>

        {/* Features */}
        <div className="w-full max-w-sm space-y-4 mb-8">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI 智能分析</h3>
              <p className="text-sm text-gray-500">拍照即可获取舌诊结果</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">隐私保护</h3>
              <p className="text-sm text-gray-500">数据仅存储在您的设备</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">历史记录</h3>
              <p className="text-sm text-gray-500">追踪体质变化趋势</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer & Button */}
      <div className="p-6 pb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">
            <strong>免责声明：</strong>本工具仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询专业医师。
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/30"
        >
          开始使用
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
