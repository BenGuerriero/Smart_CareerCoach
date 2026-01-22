import { Sparkles, FileText, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  onArtifactsClick: () => void;
  artifactCount: number;
}

export const Header = ({ isConnected, onArtifactsClick, artifactCount }: HeaderProps) => {
  return (
    <header className="border-b border-gray-800/50 bg-gradient-to-b from-black to-gray-900/50 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500
                        flex items-center justify-center shadow-xl shadow-cyan-500/30
                        animate-float">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Aang AI
            </h1>
            <p className="text-xs text-gray-500">Your Career Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            isConnected
              ? 'bg-green-500/20 border border-green-500/30'
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400">Disconnected</span>
              </>
            )}
          </div>

          <button
            onClick={onArtifactsClick}
            className="relative flex items-center gap-2 px-4 py-2 rounded-full
                     bg-gradient-to-r from-cyan-500/20 to-blue-500/20
                     border border-cyan-500/30 text-cyan-400
                     hover:from-cyan-500/30 hover:to-blue-500/30
                     transition-all duration-300 hover:scale-105"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Artifacts</span>
            {artifactCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                             bg-gradient-to-br from-orange-400 to-pink-500
                             flex items-center justify-center text-[10px] font-bold text-white
                             shadow-lg shadow-orange-500/30">
                {artifactCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
