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
      className={`fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
        <p className="text-lg font-semibold whitespace-nowrap">{message}</p>
      </div>
    </div>
  );
}
