import { useRef } from 'react';
import { ArrowLeft, Camera, Image } from 'lucide-react';

export default function CameraPage({ onBack, onCapture }) {
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
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
        <div className="absolute bottom-32 left-0 right-0 text-center z-10">
          <p className="text-white text-lg font-medium mb-2">将舌头对准框内</p>
          <p className="text-white/60 text-sm">点击下方按钮拍照或选择照片</p>
        </div>
      </main>

      {/* Bottom Controls */}
      <div className="relative z-10 p-6 pb-10 flex items-center justify-center gap-8">
        {/* Gallery Button */}
        <button
          onClick={() => galleryInputRef.current?.click()}
          className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
        >
          <Image className="w-6 h-6 text-white" />
        </button>

        {/* Capture Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 border-4 border-emerald-500 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-emerald-500" />
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
