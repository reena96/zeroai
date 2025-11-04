'use client';

import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';

export default function ChatContainer() {
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">ZeroAI Math Tutor</h1>
        <p className="text-sm text-blue-100">Your Socratic learning companion</p>
      </div>

      {/* Message List - flex-1 makes it take remaining space */}
      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>

      {/* Message Input - fixed at bottom */}
      <div className="border-t border-gray-200 bg-gray-50">
        <MessageInput />
      </div>
    </div>
  );
}
