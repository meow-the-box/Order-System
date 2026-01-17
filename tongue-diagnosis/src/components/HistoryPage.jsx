import { ArrowLeft, Trash2, ChevronRight } from 'lucide-react';
import { getConstitutionColor } from '../utils/constitution';

export default function HistoryPage({
  historyList,
  onBack,
  onViewDetail,
  onDelete,
}) {
  if (historyList.length === 0) {
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
            <h1 className="text-lg font-semibold text-gray-900">历史记录</h1>
          </div>
        </header>

        {/* Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl opacity-50">📋</span>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">暂无记录</h2>
          <p className="text-gray-500 text-center">
            完成舌诊分析后，<br />记录会保存在这里
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold text-gray-900">历史记录</h1>
          <span className="text-sm text-gray-400 ml-auto">
            共 {historyList.length} 条
          </span>
        </div>
      </header>

      {/* List */}
      <main className="flex-1 p-4">
        <div className="space-y-3">
          {historyList.map((item) => {
            const colors = getConstitutionColor(item.constitution);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div
                  className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onViewDetail(item.id)}
                >
                  {/* Constitution Badge */}
                  <div
                    className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <span className={`font-bold ${colors.text}`}>
                      {item.constitution?.slice(0, 2) || '??'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">
                      {item.constitution || '未知体质'}
                    </h3>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                {/* Delete Button */}
                <div className="border-t border-gray-100 px-4 py-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('确定要删除这条记录吗？')) {
                        onDelete(item.id);
                      }
                    }}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    删除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
