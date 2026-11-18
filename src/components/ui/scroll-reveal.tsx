'use client';

import React, { useEffect, useRef, useState } from 'react';

export type RevealVariant = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-in';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
  threshold?: number;
}

/**
 * Repeatable scroll-triggered animation wrapper powered by native IntersectionObserver.
 * Replays smoothly whenever the element exits and re-enters the viewport.
 */
export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 650,
  className = '',
  threshold = 0.08,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenTransform = (() => {
    switch (variant) {
      case 'fade-up':
        return 'translate-y-7 opacity-0';
      case 'fade-down':
        return '-translate-y-7 opacity-0';
      case 'fade-left':
        return 'translate-x-7 opacity-0';
      case 'fade-right':
        return '-translate-x-7 opacity-0';
      case 'scale-in':
        return 'scale-[0.95] translate-y-4 opacity-0';
      default:
        return 'translate-y-7 opacity-0';
    }
  })();

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
      className={`transition-all ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : hiddenTransform
      } ${className}`}
    >
      {children}
    </div>
  );
}
