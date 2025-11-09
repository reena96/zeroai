'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chat';
import Message from '@/components/Message';

export default function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Scroll on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto p-6 bg-gradient-to-b from-slate-50 to-white"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md px-6">
            <div className="mb-4 text-6xl">✨</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3">
              Welcome to ZeroAI!
            </h2>
            <p className="text-slate-600 mb-2">
              Start a conversation by typing a message below.
            </p>
            <p className="text-sm text-slate-400">
              I&apos;ll guide you through problems using Socratic questioning.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              isLatestAssistantMessage={
                message.role === 'assistant' &&
                index === messages.length - 1
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
