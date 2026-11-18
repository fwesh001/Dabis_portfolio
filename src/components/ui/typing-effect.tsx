'use client';

import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  speed?: number;
  pauseMs?: number;
  prefix?: string;
  className?: string;
  cursorClassName?: string;
}

export function TypingEffect({
  words,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1800,
  speed,
  pauseMs,
  prefix = '',
  className = '',
  cursorClassName = '',
}: TypingEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const effectiveTypingSpeed = speed ?? typingSpeed;
  const effectivePauseDuration = pauseMs ?? pauseDuration;

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentFullWord = words[currentWordIndex % words.length];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (displayedText.length < currentFullWord.length) {
            setDisplayedText(currentFullWord.substring(0, displayedText.length + 1));
          } else {
            // Reached end of word, pause then delete
            setTimeout(() => setIsDeleting(true), effectivePauseDuration);
          }
        } else {
          // Deleting
          if (displayedText.length > 0) {
            setDisplayedText(currentFullWord.substring(0, displayedText.length - 1));
          } else {
            // Finished deleting, move to next word
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : effectiveTypingSpeed
    );

    return () => clearTimeout(timer);
  }, [
    displayedText,
    isDeleting,
    currentWordIndex,
    words,
    effectiveTypingSpeed,
    deletingSpeed,
    effectivePauseDuration,
  ]);

  return (
    <span className={`inline-flex items-center font-mono ${className}`}>
      {prefix && <span className="mr-1.5 opacity-75">{prefix}</span>}
      <span className="font-bold text-[var(--accent)]">{displayedText}</span>
      <span
        className={`inline-block w-2 h-4 sm:h-5 ml-1 bg-[var(--accent)] animate-pulse ${cursorClassName}`}
      />
    </span>
  );
}
