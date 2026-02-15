import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ChatMessage {
  content: string;
  type: 'user' | 'ai' | 'system' | 'file-update' | 'command' | 'error';
  timestamp: Date;
  metadata?: any;
}

export function useChat() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      content: 'Welcome! I can help you generate code with full context of your sandbox files and structure.',
      type: 'system',
      timestamp: new Date()
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const addMessage = useCallback((message: ChatMessage) => {
    setChatMessages(prev => [...prev, message]);
  }, []);

  const sendMessage = useCallback(async (content: string, sandboxId: string, model: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      content,
      type: 'user',
      timestamp: new Date()
    };
    addMessage(userMessage);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, sandboxId, model })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const aiMessage: ChatMessage = {
        content: data.content,
        type: 'ai',
        timestamp: new Date(),
        metadata: data.metadata
      };
      addMessage(aiMessage);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      addMessage({
        content: 'Sorry, I encountered an error processing your request.',
        type: 'error',
        timestamp: new Date()
      });
    } finally {
      setIsGenerating(false);
    }
  }, [addMessage]);

  return {
    chatMessages,
    setChatMessages,
    isGenerating,
    setIsGenerating,
    isStreaming,
    setIsStreaming,
    addMessage,
    sendMessage
  };
}
