'use client';

import React, { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on coarse pointer devices (touchscreens)
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      animId = requestAnimationFrame(animateRing);
    };

    const onMouseEnterInteractive = () => {
      ringRef.current?.classList.add('scale-150', 'bg-[var(--accent)]/15', 'border-[var(--accent)]');
    };

    const onMouseLeaveInteractive = () => {
      ringRef.current?.classList.remove('scale-150', 'bg-[var(--accent)]/15', 'border-[var(--accent)]');
    };

    window.addEventListener('mousemove', onMouseMove);
    animId = requestAnimationFrame(animateRing);

    const attachHover = () => {
      const targets = document.querySelectorAll('a, button, input, select, textarea, [data-cursor="pointer"]');
      targets.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterInteractive);
        el.addEventListener('mouseleave', onMouseLeaveInteractive);
      });
    };

    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[var(--accent)] z-[9999] opacity-90 transition-opacity hidden sm:block"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 w-7 h-7 rounded-full border border-[var(--accent)]/60 z-[9998] transition-[width,height,transform,background-color] duration-150 ease-out hidden sm:block"
        style={{ willChange: 'transform' }}
      />
    </>
  );
}
