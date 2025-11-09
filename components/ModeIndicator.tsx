'use client';

import { Clock, BookOpen, Sparkles } from 'lucide-react';

interface ModeIndicatorProps {
  mode: 'homework' | 'exam' | 'explore';
}

const modeConfig = {
  homework: {
    icon: Clock,
    label: 'Homework Help',
    color: 'bg-blue-500 text-white border border-blue-400',
    tooltip: 'Efficient help mode - You can restart to change modes',
  },
  exam: {
    icon: BookOpen,
    label: 'Exam Prep',
    color: 'bg-rose-500 text-white border border-rose-400',
    tooltip: 'Fast-paced review mode - You can restart to change modes',
  },
  explore: {
    icon: Sparkles,
    label: 'Exploration',
    color: 'bg-emerald-500 text-white border border-emerald-400',
    tooltip: 'Deep exploration mode - You can restart to change modes',
  },
};

export default function ModeIndicator({ mode }: ModeIndicatorProps) {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold shadow-lg
        ${config.color}
      `}
      title={config.tooltip}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
}
