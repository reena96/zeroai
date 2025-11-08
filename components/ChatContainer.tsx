'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chat';
import { useGamificationStore } from '@/store/gamification';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import ModeSelector from '@/components/ModeSelector';
import ModeIndicator from '@/components/ModeIndicator';
import { StreakDisplay } from '@/components/StreakDisplay';

export default function ChatContainer() {
  const sessionMode = useChatStore((state) => state.sessionMode);
  const setSessionMode = useChatStore((state) => state.setSessionMode);
  const checkAndUpdateStreak = useGamificationStore((state) => state.checkAndUpdateStreak);
  const [showDefaultMessage, setShowDefaultMessage] = useState(false);

  // Initialize streak check on mount
  useEffect(() => {
    // Check and update streak when app loads (Story 4.1)
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  // Auto-select "Homework Help" after 10 seconds if no mode is selected
  useEffect(() => {
    if (sessionMode === null) {
      const timer = setTimeout(() => {
        setSessionMode('homework');
        setShowDefaultMessage(true);
        // Hide the message after 3 seconds
        setTimeout(() => setShowDefaultMessage(false), 3000);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [sessionMode, setSessionMode]);

  // Show mode selector if no mode is selected
  if (sessionMode === null) {
    return <ModeSelector onSelectMode={setSessionMode} />;
  }

  // Otherwise show the chat interface
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white">
      {/* Header with Mode Indicator and Streak */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">ZeroAI Math Tutor</h1>
            <p className="text-sm text-blue-100">
              Your Socratic learning companion
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <ModeIndicator mode={sessionMode} />
            <StreakDisplay />
          </div>
        </div>
      </div>

      {/* Default mode notification */}
      {showDefaultMessage && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 text-sm text-blue-700">
          <p className="font-medium">
            Defaulting to Homework Help mode
          </p>
        </div>
      )}

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
