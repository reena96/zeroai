'use client';

import { useEffect, useState } from 'react';

interface CelebrationToastProps {
  message: string;
  onComplete?: () => void;
}

export function CelebrationToast({ message, onComplete }: CelebrationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in immediately
    setIsVisible(true);

    // Fade out after 2 seconds
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Call onComplete after fade-out completes
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm">
        <p className="text-lg font-bold whitespace-nowrap">{message}</p>
      </div>
    </div>
  );
}
