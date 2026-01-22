import { Artifact } from '../types/chat';
import { FileText, Download, X } from 'lucide-react';

interface ArtifactPanelProps {
  artifacts: Artifact[];
  isOpen: boolean;
  onClose: () => void;
}

export const ArtifactPanel = ({ artifacts, isOpen, onClose }: ArtifactPanelProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 w-96 bg-gradient-to-b from-gray-900 to-black
                    border-l border-gray-800/50 shadow-2xl z-50 animate-slide-in-right
                    flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Artifacts
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {artifacts.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No artifacts yet</p>
            </div>
          ) : (
            artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50
                         backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4
                         hover:border-cyan-500/50 transition-all duration-300
                         group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500
                                flex items-center justify-center flex-shrink-0
                                shadow-lg shadow-cyan-500/30">
                    <FileText className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {artifact.filename}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{artifact.type}</p>
                  </div>

                  {artifact.url && (
                    <a
                      href={artifact.url}
                      download={artifact.filename}
                      className="p-2 rounded-full bg-cyan-500/20 text-cyan-400
                               hover:bg-cyan-500/30 transition-colors duration-200
                               opacity-0 group-hover:opacity-100"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
