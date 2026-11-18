'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, X } from 'lucide-react';

interface ImageLightboxProps {
  src: string | null | undefined;
  alt?: string;
  caption?: string;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  src,
  alt = 'Image preview',
  caption,
  open,
  onClose,
}: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    // Capture phase ensures Escape closes the lightbox before any underlying drawer/modal
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [open, onClose]);

  if (!mounted || !open || !src) return null;

  const displayCaption = caption ?? (alt && alt !== 'Image preview' ? alt : '');

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Full-screen image viewer'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
      className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150"
    >
      {/* Close (X) Button pinned to far top-right */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close full-screen image"
        title="Close (Esc)"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[210] w-11 h-11 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/20 hover:border-white/40 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Full-Screen Centered Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[95vw] max-h-[85vh] flex flex-col items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-w-[95vw] max-h-[82vh] w-auto h-auto object-contain rounded-xl shadow-2xl ring-1 ring-white/10 select-none"
        />

        {displayCaption && (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-mono text-zinc-200 text-center max-w-[90vw] truncate">
            {displayCaption}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

interface ExpandableImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  containerClassName?: string;
  loading?: 'lazy' | 'eager';
  stopPropagation?: boolean;
  showExpandIcon?: boolean;
  children?: React.ReactNode;
}

export function ExpandableImage({
  src,
  alt,
  caption,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  loading,
  stopPropagation = false,
  showExpandIcon = true,
  children,
}: ExpandableImageProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (stopPropagation) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen(e);
    }
  };

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        aria-label={`View ${alt || 'image'} in full screen`}
        title="Click to view full screen"
        className={`block relative group/lightbox cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${containerClassName}`}
      >
        {children ? (
          children
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} loading={loading} className={className} />
        )}

        {showExpandIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/60 text-white border border-white/20 backdrop-blur-sm opacity-0 group-hover/lightbox:opacity-100 transition-opacity duration-200 shadow-md"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </span>
        )}
      </span>

      <ImageLightbox
        src={src}
        alt={alt}
        caption={caption}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
