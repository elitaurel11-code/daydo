'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    const duration = 2000;
    const end = Date.now() + duration;

    const colors = ['#7C3AED', '#A78BFA', '#F59E0B', '#10B981', '#EF4444', '#3B82F6'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        gravity: 1.2,
        scalar: 0.8,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        gravity: 1.2,
        scalar: 0.8,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        firedRef.current = false;
        onComplete?.();
      }
    };

    frame();
  }, [trigger, onComplete]);

  return null;
}