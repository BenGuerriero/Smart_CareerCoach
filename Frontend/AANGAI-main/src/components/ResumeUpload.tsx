import { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';

interface ResumeUploadProps {
  onUpload: (file: File) => Promise<void>;
}

export const ResumeUpload = ({ onUpload }: ResumeUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setUploadStatus('error');
      return;
    }

    setFileName(file.name);
    setUploading(true);
    setUploadStatus('idle');

    try {
      await onUpload(file);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 rounded-full
                 bg-gradient-to-r from-green-500/20 to-emerald-500/20
                 border border-green-500/30 text-green-400
                 hover:from-green-500/30 hover:to-emerald-500/30
                 transition-all duration-300 hover:scale-105
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Upload className="w-4 h-4 animate-bounce" />
            <span className="text-sm">Uploading...</span>
          </>
        ) : uploadStatus === 'success' ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Uploaded!</span>
          </>
        ) : uploadStatus === 'error' ? (
          <>
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">Failed</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <span className="text-sm">Upload Resume</span>
          </>
        )}
      </button>

      {fileName && uploadStatus === 'success' && (
        <p className="text-xs text-green-400 mt-2 animate-fade-in">{fileName}</p>
      )}
    </div>
  );
};
