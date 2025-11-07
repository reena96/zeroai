'use client';

import { useState } from 'react';
import { useChatStore } from '@/store/chat';

export default function MessageInput() {
  const [input, setInput] = useState('');
  const { addMessage, isLoading, setLoading, sessionMode } = useChatStore();

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
    <div className="p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
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
            'Send'
          )}
        </button>
      </div>
    </div>
  );
}
