'use client';

import { Clock, BookOpen, Sparkles } from 'lucide-react';

interface ModeIndicatorProps {
  mode: 'homework' | 'exam' | 'explore';
}

const modeConfig = {
  homework: {
    icon: Clock,
    label: 'Homework Help',
    color: 'bg-blue-100 text-blue-700',
    tooltip: 'Efficient help mode - You can restart to change modes',
  },
  exam: {
    icon: BookOpen,
    label: 'Exam Prep',
    color: 'bg-orange-100 text-orange-700',
    tooltip: 'Fast-paced review mode - You can restart to change modes',
  },
  explore: {
    icon: Sparkles,
    label: 'Exploration',
    color: 'bg-green-100 text-green-700',
    tooltip: 'Deep exploration mode - You can restart to change modes',
  },
};

export default function ModeIndicator({ mode }: ModeIndicatorProps) {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        ${config.color}
      `}
      title={config.tooltip}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
}
