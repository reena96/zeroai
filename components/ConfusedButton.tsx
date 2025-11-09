'use client';

import { HelpCircle } from 'lucide-react';

interface ConfusedButtonProps {
  onClick: () => void;
}

/**
 * ConfusedButton - Allows students to request immediate scaffolding
 *
 * Clicking this button triggers a worked example from the AI tutor,
 * providing deeper scaffolding without waiting for the hint ladder.
 *
 * From Story 2.4: Student agency - immediate access to help when confused.
 */
export default function ConfusedButton({ onClick }: ConfusedButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mt-3 px-4 py-2 text-sm font-medium text-cyan-700 bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 border border-cyan-200 rounded-lg transition-all shadow-sm hover:shadow inline-flex items-center gap-2 min-h-[36px]"
      aria-label="I&apos;m really confused - get help"
    >
      <HelpCircle className="w-4 h-4" />
      <span>I&apos;m really confused</span>
    </button>
  );
}
