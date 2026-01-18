import { useRef, useState } from 'react';
import { ArrowLeft, Camera, Image, AlertCircle } from 'lucide-react';

export default function CameraPage({ onBack, onCapture, isAnalyzing }) {
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPermissionDenied(false);
      onCapture(file);
    } else {
      // TC-02: 用户可能拒绝了权限或取消了选择
      // 检测是否是权限问题（iOS Safari）
      if (e.target.getAttribute('capture')) {
        setPermissionDenied(true);
      }
    }
    // 重置 input 以便重复选择同一文件
    e.target.value = '';
  };

  const handleCameraClick = () => {
    if (isAnalyzing) return;
    setPermissionDenied(false);
    fileInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    if (isAnalyzing) return;
    setPermissionDenied(false);
    galleryInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center safe-area-top">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          disabled={isAnalyzing}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </header>

      {/* Camera View Area */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />

        {/* Tongue Guide Overlay - More visible */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Dark overlay with cutout */}
          <div className="relative w-64 h-80">
            {/* Guide frame */}
            <div
              className="absolute inset-0 border-4 border-white border-dashed rounded-[50%] opacity-80"
              style={{
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                animation: 'pulse 2s infinite'
              }}
            />

            {/* Corner markers */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full" />
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full" />
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full" />
          </div>
        </div>

        {/* Guide text */}
        <div className="absolute bottom-36 left-0 right-0 text-center z-10 px-6">
          <p className="text-white text-lg font-medium mb-2">将舌头对准框内</p>
          <p className="text-white/60 text-sm">点击下方按钮拍照或选择照片</p>

          {/* TC-02: 权限拒绝提示 */}
          {permissionDenied && (
            <div className="mt-4 bg-amber-500/20 border border-amber-500/50 rounded-xl p-3 mx-auto max-w-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-amber-200 text-sm font-medium">无法访问相机</p>
                  <p className="text-amber-200/70 text-xs mt-1">
                    请在系统设置中允许本网站访问相机，或选择从相册上传照片
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* TC-03: Bottom Controls with safe area */}
      <div className="relative z-10 p-6 pb-10 flex items-center justify-center gap-8 safe-area-bottom">
        {/* Gallery Button */}
        <button
          onClick={handleGalleryClick}
          disabled={isAnalyzing}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            isAnalyzing
              ? 'bg-white/10 cursor-not-allowed'
              : 'bg-white/20 hover:bg-white/30'
          }`}
        >
          <Image className="w-6 h-6 text-white" />
        </button>

        {/* Capture Button - TC-09: 禁用状态 */}
        <button
          onClick={handleCameraClick}
          disabled={isAnalyzing}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isAnalyzing
              ? 'bg-gray-400 cursor-not-allowed scale-95'
              : 'bg-white hover:scale-105'
          }`}
        >
          <div className={`w-16 h-16 border-4 rounded-full flex items-center justify-center ${
            isAnalyzing ? 'border-gray-500' : 'border-emerald-500'
          }`}>
            <Camera className={`w-8 h-8 ${isAnalyzing ? 'text-gray-500' : 'text-emerald-500'}`} />
          </div>
        </button>

        {/* Placeholder for symmetry */}
        <div className="w-14 h-14" />
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
