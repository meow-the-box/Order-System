import { Camera, History, HelpCircle } from 'lucide-react';

export default function HomePage({ onStartDiagnosis, onViewHistory, onViewInstructions }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👅</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">中医智能舌诊</h1>
              <p className="text-xs text-gray-500">AI 分析 · 了解体质</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        {/* Main Action Button */}
        <button
          onClick={onStartDiagnosis}
          className="w-48 h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform"
        >
          <Camera className="w-16 h-16 text-white mb-2" />
          <span className="text-white font-bold text-xl">开始舌诊</span>
        </button>

        <p className="text-gray-400 text-sm mt-6">点击上方按钮拍摄舌头照片</p>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="flex gap-4">
          <button
            onClick={onViewHistory}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <History className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">历史记录</span>
          </button>

          <button
            onClick={onViewInstructions}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">使用说明</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
