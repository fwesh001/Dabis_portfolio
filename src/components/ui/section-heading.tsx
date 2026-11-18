import React from 'react';

interface SectionHeadingProps {
  number: string;
  title: string;
  className?: string;
}

/**
 * Editorial oversized section number behind bold overlapping title.
 * Matches the muted accent watermark typography style.
 */
export function SectionHeading({ number, title, className = '' }: SectionHeadingProps) {
  return (
    <div className={`relative select-none pt-1 ${className}`}>
      <span
        aria-hidden="true"
        className="block font-mono font-black text-6xl sm:text-7xl md:text-8xl leading-[0.82] tracking-tighter"
        style={{
          color: 'var(--accent)',
          opacity: 0.18,
          fontVariantNumeric: 'slashed-zero',
        }}
      >
        {number}
      </span>
      <h2 className="relative z-10 -mt-5 sm:-mt-7 md:-mt-8 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
        {title}
      </h2>
    </div>
  );
}
