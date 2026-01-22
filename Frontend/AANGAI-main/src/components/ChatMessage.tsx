import { Message } from '../types/chat';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-start`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser
            ? 'bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg shadow-orange-500/30'
            : 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-blue-500/30'
        }`}>
          {isUser ? (
            <span className="text-white font-bold text-sm">You</span>
          ) : (
            <Sparkles className="w-5 h-5 text-white" />
          )}
        </div>

        <div className={`relative ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
          <div className={`rounded-3xl px-6 py-4 shadow-xl ${
            isUser
              ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white'
              : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 border border-gray-700/50'
          } ${message.streaming ? 'animate-pulse' : ''}`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            {message.streaming && (
              <span className="inline-block ml-1 w-2 h-4 bg-current animate-blink"></span>
            )}
          </div>

          <span className={`text-xs text-gray-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
