"use client";

import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export const CompanionChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'System initialized. Space: Skills on Demand, Clarity in Collapse. How can I guide you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content, suggestions: data.suggestions }]);
      }
    } catch (err) {
      console.error('Chat failed', err);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[200] brutalist-button rounded-none px-6 py-3 font-bold uppercase tracking-widest"
      >
        {isOpen ? 'Close [x]' : 'Space Chat'}
      </button>

      {/* Chat Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full md:w-[400px] bg-white dark:bg-black border-l-4 border-black dark:border-white z-[199] transition-transform duration-300 transform",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-8 h-full flex flex-col">
          <div className="mb-8 border-b-4 border-black dark:border-white pb-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter italic">Companion</h2>
            <p className="font-mono text-xs opacity-60 uppercase">Adaptive Workflow Assistant</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar mb-8">
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "p-4 border-2 font-mono text-sm",
                m.role === 'assistant' 
                  ? "bg-black text-white border-white self-start" 
                  : "bg-white text-black border-black self-end ml-8"
              )}>
                <div className="uppercase font-bold mb-1 text-[10px] opacity-50">
                  {m.role === 'assistant' ? '[SPACE]' : '[DEVELOPER]'}
                </div>
                {m.content}
                
                {m.suggestions && (
                  <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                    <p className="text-[10px] uppercase font-bold opacity-50">Suggested Commands:</p>
                    {m.suggestions.map((s: string, j: number) => (
                      <div 
                        key={j} 
                        className="text-xs hover:underline cursor-pointer"
                        onClick={() => setInput(s)}
                      >
                        &gt; {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="mt-auto">
            <div className="relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="ENTER COMMAND OR ASK QUESTIONS..."
                className="w-full p-4 bg-transparent border-4 border-black dark:border-white font-mono text-sm focus:outline-none resize-none h-24"
              />
              <button 
                onClick={handleSend}
                className="absolute bottom-2 right-2 brutalist-button text-xs py-1"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
