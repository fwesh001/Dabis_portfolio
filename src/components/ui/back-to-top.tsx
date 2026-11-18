'use client';

import React, { useEffect, useState } from 'react';

/**
 * Sticky floating Back-to-Top trigger: minimalist upward arrow with an animated traced tail.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 group w-11 h-14 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)] shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Upward Arrow with Animated Traced Tail */}
      <svg
        width="18"
        height="34"
        viewBox="0 0 18 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible text-zinc-700 dark:text-zinc-200 group-hover:text-[var(--accent)] transition-colors duration-300"
      >
        {/* Soft faded traced tail backdrop */}
        <line
          x1="9"
          y1="32"
          x2="9"
          y2="6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2 3"
          className="opacity-35 group-hover:opacity-70 transition-opacity duration-300"
        />
        {/* Active traced tail that draws upward on hover */}
        <line
          x1="9"
          y1="28"
          x2="9"
          y2="5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          className="back-to-top-tail"
        />
        {/* Upward arrowhead */}
        <path
          d="M3.5 10.5L9 4.5L14.5 10.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />
      </svg>
    </button>
  );
}
