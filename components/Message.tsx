'use client';

import { Message as MessageType } from '@/store/chat';
import { useChatStore } from '@/store/chat';
import ConfusedButton from './ConfusedButton';

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const triggerConfusedClick = useChatStore((state) => state.triggerConfusedClick);
  const showConfusedButton = useChatStore((state) => state.metadata.showConfusedButton);

  // System messages are not displayed (used for internal API communication)
  if (isSystem) {
    return null;
  }

  // Show confused button based on LLM-detected struggle state and conversation depth
  // This is dynamically set by the API based on student's performance
  const shouldShowConfusedButton = !isUser && showConfusedButton;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-3 ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        {/* Role indicator */}
        <div className={`text-xs font-semibold mb-1 ${isUser ? 'text-blue-100' : 'text-gray-600'}`}>
          {isUser ? 'You' : 'AI Tutor'}
        </div>

        {/* Message content */}
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Timestamp */}
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>

        {/* Story 2.4: Confused button on AI messages (only after 3+ exchanges) */}
        {shouldShowConfusedButton && (
          <ConfusedButton onClick={triggerConfusedClick} />
        )}
      </div>
    </div>
  );
}
