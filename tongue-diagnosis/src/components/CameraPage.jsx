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
      <main className="flex-1 flex items-center justify-center relative">
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />

        {/* Tongue Guide Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 150"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Semi-transparent mask */}
          <defs>
            <mask id="tongueMask">
              <rect width="100" height="150" fill="white" />
              <ellipse cx="50" cy="70" rx="28" ry="38" fill="black" />
            </mask>
          </defs>
          <rect
            width="100"
            height="150"
            fill="rgba(0,0,0,0.6)"
            mask="url(#tongueMask)"
          />

          {/* Guide ellipse */}
          <ellipse
            cx="50"
            cy="70"
            rx="28"
            ry="38"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeDasharray="3,2"
            className="animate-pulse"
          />

          {/* Guide text */}
          <text
            x="50"
            y="120"
            textAnchor="middle"
            fill="white"
            fontSize="4"
            opacity="0.8"
          >
            将舌头对准框内
          </text>
        </svg>

        {/* Center prompt */}
        <div className="relative z-10 text-center">
          <p className="text-white/60 text-sm">点击下方按钮选择照片</p>
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
