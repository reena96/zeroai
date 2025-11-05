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
      className="h-full overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Welcome to ZeroAI! 👋</p>
            <p className="text-sm">
              Start a conversation by typing a message below.
            </p>
            <p className="text-xs mt-2 text-gray-400">
              I&apos;ll guide you through problems using Socratic questioning.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}
