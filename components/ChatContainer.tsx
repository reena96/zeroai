'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '@/store/chat';
import { useGamificationStore } from '@/store/gamification';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';
import ModeSelector from '@/components/ModeSelector';
import ModeIndicator from '@/components/ModeIndicator';
import { StreakDisplay } from '@/components/StreakDisplay';
import { ProblemCounter } from '@/components/ProblemCounter';

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
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Mode Indicator and Stats */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 text-white p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              ZeroAI Math Tutor
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100 font-medium mt-1">
              Your Socratic learning companion
            </p>
          </div>
          <div className="sm:ml-auto">
            <ModeIndicator mode={sessionMode} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <StreakDisplay />
          <ProblemCounter />
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
