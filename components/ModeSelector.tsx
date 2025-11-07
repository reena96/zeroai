'use client';

import { Clock, BookOpen, Sparkles } from 'lucide-react';
import type { SessionMode } from '@/store/chat';

interface ModeOption {
  id: 'homework' | 'exam' | 'explore';
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const modes: ModeOption[] = [
  {
    id: 'homework',
    icon: Clock,
    name: 'Homework Help',
    description: 'Due soon? Get efficient help that still teaches',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100',
  },
  {
    id: 'exam',
    icon: BookOpen,
    name: 'Exam Prep',
    description: 'Test coming up? Fast-paced review',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
  },
  {
    id: 'explore',
    icon: Sparkles,
    name: 'Exploration',
    description: 'Learning for fun? Deep patient guidance',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100',
  },
];

interface ModeSelectorProps {
  onSelectMode: (mode: Exclude<SessionMode, null>) => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-white p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ZeroAI! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Choose your learning mode to get started
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your AI tutor will adapt its pacing to match your situation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`
                  flex flex-col items-center p-6 rounded-lg border-2 border-transparent
                  ${mode.bgColor} ${mode.hoverColor}
                  transition-all duration-200 ease-in-out
                  hover:border-current hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
                  min-h-[140px] cursor-pointer
                  ${mode.color}
                `}
                style={{ minHeight: '120px' }}
              >
                <Icon className="w-10 h-10 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {mode.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {mode.description}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 text-center">
          You can restart the session to change modes later
        </p>
      </div>
    </div>
  );
}
