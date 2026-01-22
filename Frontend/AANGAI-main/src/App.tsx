import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { Message, JobCard, Artifact, SAMMessage } from './types/chat';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ResumeUpload } from './components/ResumeUpload';
import { JobCardsGrid } from './components/JobCard';
import { ArtifactPanel } from './components/ArtifactPanel';

function App() {
  const { isConnected, sessionId, sendMessage, onMessage } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showArtifacts, setShowArtifacts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageRef = useRef<string>('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const unsubscribe = onMessage((message: SAMMessage) => {
      switch (message.type) {
        case 'assistant_message_chunk':
          setIsStreaming(true);
          currentMessageRef.current += message.content;
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant' && lastMessage.streaming) {
              return [
                ...prev.slice(0, -1),
                { ...lastMessage, content: currentMessageRef.current },
              ];
            } else {
              return [
                ...prev,
                {
                  id: `msg-${Date.now()}`,
                  role: 'assistant',
                  content: currentMessageRef.current,
                  timestamp: new Date(),
                  streaming: true,
                },
              ];
            }
          });
          break;

        case 'assistant_message_complete':
          setIsStreaming(false);
          currentMessageRef.current = '';
          setMessages((prev) =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 && msg.streaming
                ? { ...msg, streaming: false }
                : msg
            )
          );
          break;

        case 'artifact_created':
          setArtifacts((prev) => [...prev, message.artifact]);
          break;

        case 'status_update':
          console.log('Status:', message.status);
          break;
      }
    });

    return unsubscribe;
  }, [onMessage]);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!isConnected) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      sendMessage(content);

      const jobKeywords = ['job', 'career', 'role', 'position', 'opportunity'];
      if (jobKeywords.some((keyword) => content.toLowerCase().includes(keyword))) {
        setTimeout(() => {
          const mockJobs: JobCard[] = [
            {
              id: '1',
              title: 'Senior Software Engineer',
              explanation: 'Perfect match for your full-stack experience and leadership skills.',
              matchScore: 95,
            },
            {
              id: '2',
              title: 'Technical Lead',
              explanation: 'Great fit considering your project management background.',
              matchScore: 88,
            },
            {
              id: '3',
              title: 'Product Engineer',
              explanation: 'Your cross-functional skills align well with this role.',
              matchScore: 82,
            },
          ];
          setJobs(mockJobs);
        }, 2000);
      }
    },
    [isConnected, sendMessage]
  );

  const handleResumeUpload = async (file: File) => {
    const mockArtifact: Artifact = {
      id: `artifact-${Date.now()}`,
      filename: file.name,
      type: file.type,
    };
    setArtifacts((prev) => [...prev, mockArtifact]);

    const confirmMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `✨ I've received your resume "${file.name}". I can now help you with personalized career advice based on your experience!`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, confirmMessage]);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-50" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col h-screen">
        <Header
          isConnected={isConnected}
          onArtifactsClick={() => setShowArtifacts(!showArtifacts)}
          artifactCount={artifacts.length}
        />

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-fade-in">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500
                              flex items-center justify-center shadow-2xl shadow-cyan-500/30
                              animate-float mb-6">
                  <span className="text-4xl">✨</span>
                </div>
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Welcome to Aang AI
                </h2>
                <p className="text-gray-400 text-center max-w-md mb-8">
                  Your intelligent career assistant powered by Solace Agent Mesh. Upload your resume and ask me anything about your career path.
                </p>
                <ResumeUpload onUpload={handleResumeUpload} />
              </div>
            ) : (
              <>
                <div className="space-y-1 mb-8">
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} />
                  ))}
                  {isStreaming && messages[messages.length - 1]?.role === 'assistant' && (
                    <div className="flex justify-start mb-6">
                      <div className="text-sm text-cyan-400 animate-pulse flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span>Aang AI is thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {jobs.length > 0 && <JobCardsGrid jobs={jobs} />}

                <div className="flex justify-center mt-8">
                  <ResumeUpload onUpload={handleResumeUpload} />
                </div>
              </>
            )}
          </div>
        </div>

        <ChatInput
          onSend={handleSendMessage}
          disabled={!isConnected}
          isStreaming={isStreaming}
        />
      </div>

      <ArtifactPanel
        artifacts={artifacts}
        isOpen={showArtifacts}
        onClose={() => setShowArtifacts(false)}
      />
    </div>
  );
}

export default App;
