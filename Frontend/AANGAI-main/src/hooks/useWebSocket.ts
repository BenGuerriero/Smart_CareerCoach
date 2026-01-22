import { useEffect, useRef, useState, useCallback } from 'react';
import { SAMMessage, UserMessage } from '../types/chat';

const WS_URL = 'ws://localhost:8000/ws/chat';
const SESSION_KEY = 'aang_ai_session_id';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageHandlersRef = useRef<((message: SAMMessage) => void)[]>([]);

  const getOrCreateSessionId = useCallback(() => {
    let storedSessionId = localStorage.getItem(SESSION_KEY);
    if (!storedSessionId) {
      storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(SESSION_KEY, storedSessionId);
    }
    return storedSessionId;
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('✅ Connected to SAM Gateway');
      setIsConnected(true);
      const sid = getOrCreateSessionId();
      setSessionId(sid);
    };

    ws.onmessage = (event) => {
      try {
        const message: SAMMessage = JSON.parse(event.data);
        messageHandlersRef.current.forEach(handler => handler(message));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('❌ Disconnected from SAM Gateway');
      setIsConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log('🔄 Attempting to reconnect...');
        connect();
      }, 3000);
    };

    wsRef.current = ws;
  }, [getOrCreateSessionId]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN && sessionId) {
      const message: UserMessage = {
        type: 'user_message',
        content,
        session_id: sessionId,
      };
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [sessionId]);

  const onMessage = useCallback((handler: (message: SAMMessage) => void) => {
    messageHandlersRef.current.push(handler);
    return () => {
      messageHandlersRef.current = messageHandlersRef.current.filter(h => h !== handler);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    sessionId,
    sendMessage,
    onMessage,
  };
};
