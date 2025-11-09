'use client';

import { Message as MessageType } from '@/store/chat';
import { useChatStore } from '@/store/chat';
import ConfusedButton from './ConfusedButton';
import { MathText } from './MathText';

interface MessageProps {
  message: MessageType;
  isLatestAssistantMessage?: boolean;
}

export default function Message({ message, isLatestAssistantMessage = false }: MessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const triggerConfusedClick = useChatStore((state) => state.triggerConfusedClick);
  const showConfusedButton = useChatStore((state) => state.metadata.showConfusedButton);

  // System messages are not displayed (used for internal API communication)
  if (isSystem) {
    return null;
  }

  // Show confused button ONLY on the LATEST assistant message
  // when struggle state is detected and conversation depth >= 6 exchanges
  const shouldShowConfusedButton = isLatestAssistantMessage && showConfusedButton;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2 px-2`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 relative overflow-hidden ${
          isUser
            ? 'bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/30 border border-cyan-400/50'
            : 'bg-gradient-to-br from-white to-slate-50 text-slate-800 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow'
        }`}
      >
        {/* Shine effect overlay */}
        <div className={`absolute inset-0 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-tr from-white/0 via-white/10 to-white/0'
            : 'bg-gradient-to-tr from-cyan-500/0 via-cyan-500/5 to-cyan-500/0'
        }`} />

        {/* Content wrapper with relative positioning */}
        <div className="relative z-10">
          {/* Message content */}
          <div className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${isUser ? 'text-white' : 'text-slate-700'}`}>
            {isUser ? message.content : <MathText text={message.content} />}
          </div>

          {/* Timestamp below message, aligned right */}
          <div className={`text-[11px] text-right mt-1 ${isUser ? 'text-cyan-50' : 'text-slate-500'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>

          {/* Story 2.4: Confused button on AI messages (only after 3+ exchanges) */}
          {shouldShowConfusedButton && (
            <ConfusedButton onClick={triggerConfusedClick} />
          )}
        </div>
      </div>
    </div>
  );
}
