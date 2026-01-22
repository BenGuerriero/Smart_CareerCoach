import { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export const ChatInput = ({ onSend, disabled, isStreaming }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800/50 bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Aang AI anything about your career..."
              disabled={disabled}
              rows={1}
              className="w-full bg-gray-800/50 backdrop-blur-xl text-white placeholder-gray-500
                       rounded-3xl px-6 py-4 pr-12 resize-none border border-gray-700/50
                       focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-xl transition-all duration-300"
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />
            {isStreaming && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500
                     hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center shadow-xl shadow-cyan-500/30
                     transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mt-3 text-center">
          Aang AI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};
