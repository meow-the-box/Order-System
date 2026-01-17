import { ArrowLeft, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { getConstitutionColor, constitutionInfo } from '../utils/constitution';

export default function ResultPage({
  result,
  image,
  onBack,
  onSave,
  onRetry,
  isSaved,
  isFromHistory,
}) {
  const colors = getConstitutionColor(result.constitution);

  // 特征标签
  const FeatureTag = ({ label, value }) => (
    <div className="bg-gray-100 rounded-lg px-3 py-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );

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
          <h1 className="text-lg font-semibold text-gray-900">分析结果</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 pb-32 overflow-auto">
        {/* Image */}
        {image && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <img
              src={image}
              alt="舌头照片"
              className="w-full aspect-[4/3] object-cover rounded-xl"
            />
          </div>
        )}

        {/* Constitution Card */}
        <div className={`${colors.bg} ${colors.border} border rounded-2xl p-6 mb-4`}>
          <p className="text-sm text-gray-600 mb-1">您的体质类型</p>
          <h2 className={`text-3xl font-bold ${colors.text} mb-2`}>
            {result.constitution}
          </h2>
          <p className="text-sm text-gray-600 mb-3">
            可信度：{result.confidence || '中等'}
          </p>
          <p className="text-sm text-gray-700">
            {constitutionInfo[result.constitution] || ''}
          </p>
        </div>

        {/* Tongue Features */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">舌象特征</h3>
          <div className="grid grid-cols-2 gap-2">
            <FeatureTag label="舌色" value={result.tongueColor} />
            <FeatureTag label="舌形" value={result.tongueShape} />
            <FeatureTag label="舌苔颜色" value={result.coatingColor} />
            <FeatureTag label="舌苔厚薄" value={result.coatingThickness} />
            <FeatureTag label="舌苔性质" value={result.coatingTexture} />
            <FeatureTag
              label="齿痕/裂纹"
              value={`${result.hasTeethMarks ? '有齿痕' : '无齿痕'} / ${result.hasCracks ? '有裂纹' : '无裂纹'}`}
            />
          </div>
          {result.features && result.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Health Status */}
        {result.healthStatus && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">健康状态</h3>
            <p className="text-gray-600">{result.healthStatus}</p>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">调理建议</h3>

            {/* Diet */}
            {result.recommendations.diet && (
              <div className="mb-4">
                <p className="text-sm font-medium text-emerald-600 mb-2">🥗 饮食建议</p>
                <div className="flex flex-wrap gap-2">
                  {result.recommendations.diet.map((item, index) => (
                    <span
                      key={index}
                      className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {result.recommendations.lifestyle && (
              <div className="mb-4">
                <p className="text-sm font-medium text-blue-600 mb-2">🏃 生活方式</p>
                <ul className="space-y-1">
                  {result.recommendations.lifestyle.map((item, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Acupoints */}
            {result.recommendations.acupoints && (
              <div>
                <p className="text-sm font-medium text-purple-600 mb-2">📍 穴位按摩</p>
                <div className="flex flex-wrap gap-2">
                  {result.recommendations.acupoints.map((item, index) => (
                    <span
                      key={index}
                      className="bg-purple-50 text-purple-700 text-sm px-3 py-1 rounded-lg"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>免责声明：</strong>本分析结果仅供参考，不能替代专业医疗诊断。如有健康问题，请咨询专业医师。
          </p>
        </div>
      </main>

      {/* Bottom Actions */}
      {!isFromHistory && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">重新分析</span>
          </button>

          <button
            onClick={onSave}
            disabled={isSaved}
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
              isSaved
                ? 'bg-gray-100 text-gray-400'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            <Save className="w-5 h-5" />
            <span className="font-medium">{isSaved ? '已保存' : '保存记录'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
