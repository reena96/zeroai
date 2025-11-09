'use client';

import { useState } from 'react';
import { useChatStore } from '@/store/chat';
import { useGamificationStore } from '@/store/gamification';
import { ImageUpload } from './ImageUpload';
import { CelebrationToast } from './CelebrationToast';
import { getCelebrationMessage, formatCelebrationMessage } from '@/lib/celebration';

export default function MessageInput() {
  const [input, setInput] = useState('');
  const { addMessage, isLoading, setLoading, sessionMode, setStruggleState } = useChatStore();
  const incrementStreak = useGamificationStore((state) => state.incrementStreak);
  const incrementProblemCount = useGamificationStore((state) => state.incrementProblemCount);
  const currentStreak = useGamificationStore((state) => state.streakData.currentStreak);
  const totalProblems = useGamificationStore((state) => state.totalProblems);

  // Celebration state
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  // Handle extracted text from image upload
  const handleImageExtract = (text: string) => {
    setInput(text);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();

    // Add user message
    addMessage('user', userMessage);

    // Clear input
    setInput('');

    // Call OpenAI API
    setLoading(true);

    try {
      // Get conversation history from store
      const messages = useChatStore.getState().messages;

      // Send request to API route with sessionMode
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionMode: sessionMode, // Pass mode for adaptive prompting
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Read struggle state and problem solved from response headers
      const struggleState = response.headers.get('X-Struggle-State');
      const isStruggling = struggleState === 'true';
      const problemSolved = response.headers.get('X-Problem-Solved');
      const wasProblemSolved = problemSolved === 'true';

      // Debug logging
      console.log('[MessageInput] Problem solved header:', problemSolved, 'wasProblemSolved:', wasProblemSolved);

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      // Create a new message for the AI response
      let aiResponse = '';
      const { addMessage: addMsg } = useChatStore.getState();

      // Add initial empty message
      addMsg('assistant', '');
      const currentMessages = useChatStore.getState().messages;
      const aiMessageIndex = currentMessages.length - 1;

      // Read streaming chunks
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode chunk and append to response
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        // Update the last message in the store with accumulated response
        const messages = useChatStore.getState().messages;
        const updatedMessages = [...messages];
        updatedMessages[aiMessageIndex] = {
          ...updatedMessages[aiMessageIndex],
          content: aiResponse,
        };
        useChatStore.setState({ messages: updatedMessages });
      }

      // Update struggle state in store after response is complete
      setStruggleState(isStruggling);

      // Story 4.1, 4.2, 4.3: Celebrate when student solves problem correctly
      if (wasProblemSolved) {
        console.log('[MessageInput] 🎉 Problem solved! Triggering celebration...');

        // Increment streak
        const streakMilestone = incrementStreak();

        // Increment problem count
        const confusedClicked = useChatStore.getState().metadata.confusedClicked;
        const isSoloSolve = !confusedClicked;
        const problemMilestone = incrementProblemCount(isSoloSolve);

        // Story 4.3: Trigger celebration with confetti and toast
        const baseMessage = getCelebrationMessage();
        const fullMessage = formatCelebrationMessage(baseMessage, currentStreak, totalProblems + 1); // +1 because just incremented

        console.log('[MessageInput] Triggering confetti with message:', fullMessage);

        // Trigger confetti animation (dynamic import for client-side only)
        import('@/lib/celebration').then((mod) => {
          console.log('[MessageInput] Confetti module loaded, calling triggerConfetti...');
          mod.triggerConfetti();
        }).catch((err) => {
          console.error('[MessageInput] Failed to load confetti:', err);
        });

        // Show toast message
        setCelebrationMessage(fullMessage);

        // Log milestones for debugging
        if (streakMilestone.reached && streakMilestone.message) {
          console.log('[Streak Milestone]', streakMilestone.message);
        }
        if (problemMilestone.reached && problemMilestone.message) {
          console.log('[Problem Milestone]', problemMilestone.message);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error calling API:', error);
      setLoading(false);

      // Add error message
      addMessage(
        'assistant',
        "Sorry, I encountered an error. Please check your API key configuration and try again. You can retry by sending your message again."
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-5 bg-white border-t border-slate-200 space-y-3">
      {/* Celebration Toast */}
      {celebrationMessage && (
        <CelebrationToast
          message={celebrationMessage}
          onComplete={() => setCelebrationMessage(null)}
        />
      )}

      {/* Image Upload */}
      <ImageUpload onExtract={handleImageExtract} />

      {/* Text Input */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your math problem here..."
          disabled={isLoading}
          className="flex-1 px-5 py-3.5 min-h-[48px] bg-white border-2 border-slate-200 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/10 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all shadow-sm touch-manipulation"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="relative overflow-hidden px-8 py-3.5 min-h-[48px] bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-600 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 border border-cyan-400/50 touch-manipulation sm:min-w-[100px]"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
          {isLoading ? (
            <span className="flex items-center gap-2 relative z-10">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Thinking...
            </span>
          ) : (
            <span className="relative z-10">Send</span>
          )}
        </button>
      </div>
    </div>
  );
}
