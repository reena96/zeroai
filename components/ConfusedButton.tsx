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
      className="mt-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-md transition-colors inline-flex items-center gap-1.5 min-h-[36px]"
      aria-label="I&apos;m really confused - get help"
    >
      <HelpCircle className="w-4 h-4" />
      <span>I&apos;m really confused</span>
    </button>
  );
}
