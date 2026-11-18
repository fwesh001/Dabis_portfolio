'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Copy, Link as LinkIcon, Command, SunMoon, Github, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface CustomContextMenuProps {
  onOpenCommandPalette?: () => void;
  email?: string;
  githubUrl?: string;
}

export function CustomContextMenu({
  onOpenCommandPalette,
  email = 'admin@olehidavis.dev',
  githubUrl = 'https://github.com/18d-shady',
}: CustomContextMenuProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Developer escape hatch: holding Shift opens native context menu
      if (e.shiftKey) return;

      e.preventDefault();
      const menuWidth = 220;
      const menuHeight = 260;
      const x = Math.min(e.clientX, window.innerWidth - menuWidth);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight);

      setPosition({ x, y });
      setVisible(true);
    };

    const handleClick = () => setVisible(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!visible) return null;

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success(`Copied email (${email}) to clipboard`);
    setVisible(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Current URL copied to clipboard');
    setVisible(false);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    setVisible(false);
  };

  return (
    <div
      role="menu"
      className="fixed z-50 w-56 bg-zinc-950/95 dark:bg-zinc-950/95 bg-white/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-1.5 text-xs text-zinc-700 dark:text-zinc-300 font-sans animate-in fade-in zoom-in-95 duration-100"
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={copyEmail}
        className="w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors text-left"
      >
        <Copy className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span>Copy Email Address</span>
      </button>

      <button
        onClick={copyUrl}
        className="w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors text-left"
      >
        <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
        <span>Copy Page URL</span>
      </button>

      <div className="my-1 border-t border-zinc-200 dark:border-zinc-800/80" />

      <button
        onClick={() => {
          setVisible(false);
          onOpenCommandPalette?.();
        }}
        className="w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-black dark:hover:text-white flex items-center justify-between transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Command className="w-3.5 h-3.5 text-zinc-400" />
          <span>Command Palette</span>
        </div>
        <kbd className="text-[9px] font-mono text-zinc-500">⌘K</kbd>
      </button>

      <button
        onClick={toggleTheme}
        className="w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-black dark:hover:text-white flex items-center gap-2 transition-colors text-left"
      >
        <SunMoon className="w-3.5 h-3.5 text-zinc-400" />
        <span>Toggle Dark/Light Mode</span>
      </button>

      <div className="my-1 border-t border-zinc-200 dark:border-zinc-800/80" />

      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setVisible(false)}
        className="w-full px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-black dark:hover:text-white flex items-center justify-between transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Github className="w-3.5 h-3.5 text-zinc-400" />
          <span>GitHub Profile</span>
        </div>
        <ArrowRight className="w-3 h-3 text-zinc-500" />
      </a>

      <div className="px-2 pt-1.5 pb-0.5 text-[9px] font-mono text-zinc-500 border-t border-zinc-200 dark:border-zinc-800/60 mt-1">
        Shift + Right-Click for native menu
      </div>
    </div>
  );
}
