import confetti from 'canvas-confetti';

/**
 * Celebration message templates
 * Randomized to avoid repetition
 */
const CELEBRATION_MESSAGES = [
  'You did it! 🎉',
  'Nice work! ⭐',
  'Excellent! Keep it up! 💪',
  'Great job! 🌟',
  'Fantastic! 🚀',
  'Amazing work! 💯',
  'Well done! 🎊',
  'Brilliant! ✨',
];

/**
 * Get a random celebration message
 * Never returns the same message twice in a row
 */
let lastMessageIndex = -1;

export function getCelebrationMessage(): string {
  let index = Math.floor(Math.random() * CELEBRATION_MESSAGES.length);

  // Avoid repeating the last message
  if (index === lastMessageIndex && CELEBRATION_MESSAGES.length > 1) {
    index = (index + 1) % CELEBRATION_MESSAGES.length;
  }

  lastMessageIndex = index;
  return CELEBRATION_MESSAGES[index];
}

/**
 * Format celebration message with streak/problem data
 */
export function formatCelebrationMessage(baseMessage: string, currentStreak: number, totalProblems: number): string {
  if (currentStreak > 1) {
    return `${baseMessage} 🔥 ${currentStreak} day streak!`;
  }
  if (totalProblems > 0) {
    return `${baseMessage} ${totalProblems} problems solved!`;
  }
  return baseMessage;
}

/**
 * Trigger confetti animation
 * Duration: 2.5 seconds
 * Non-blocking, smooth performance
 */
export function triggerConfetti() {
  try {
    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    });

    // Follow-up burst after small delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
      });
    }, 400);
  } catch (error) {
    console.error('[Celebration] Error triggering confetti:', error);
  }
}
