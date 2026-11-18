'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Home,
  Wrench,
  FolderGit2,
  LayoutGrid,
  Copy,
  Link as LinkIcon,
  FileText,
  SunMoon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface MobileQuickSheetProps {
  onOpenResume?: () => void;
  email?: string;
}

export function MobileQuickSheet({ onOpenResume, email = 'admin@olehidavis.dev' }: MobileQuickSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success(`Copied email (${email})`);
    setIsOpen(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Portfolio URL copied to clipboard');
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Technical Grid Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="grid grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800/80 h-16 font-mono text-[10px]">
          <Link
            href="/#hero"
            className="flex flex-col items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:bg-zinc-100 dark:active:bg-zinc-900 transition-colors"
          >
            <Home className="w-4 h-4 text-[var(--accent)]" />
            <span>Overview</span>
          </Link>

          <Link
            href="/#services"
            className="flex flex-col items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:bg-zinc-100 dark:active:bg-zinc-900 transition-colors"
          >
            <Wrench className="w-4 h-4 text-[var(--accent)]" />
            <span>Services</span>
          </Link>

          <Link
            href="/#projects"
            className="flex flex-col items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white active:bg-zinc-100 dark:active:bg-zinc-900 transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-[var(--accent)]" />
            <span>Projects</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-zinc-900 dark:text-zinc-100 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 active:bg-zinc-200 dark:active:bg-zinc-800 transition-colors"
          >
            <LayoutGrid className="w-4 h-4 text-[var(--accent)]" />
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Quick Actions & Navigation Sheet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 rounded-t-3xl p-5 space-y-4 shadow-2xl overflow-y-auto animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-2" />

            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-white">Olehi Davis</div>
                <div className="text-[10px] font-mono text-zinc-500">Navigation &amp; Quick Actions</div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={copyEmail}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left flex flex-col gap-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <Copy className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">Copy Email</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenResume?.();
                }}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left flex flex-col gap-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">View Resume</span>
              </button>
              <button
                type="button"
                onClick={copyUrl}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left flex flex-col gap-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <LinkIcon className="w-4 h-4 text-purple-400" />
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">Copy URL</span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left flex flex-col gap-1.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <SunMoon className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">Toggle Theme</span>
              </button>
            </div>

            {/* Jump Links */}
            <div className="space-y-1 pt-2 font-mono">
              <div className="text-[10px] text-zinc-500 uppercase px-1">Jump to Section</div>
              <Link
                href="/#hero"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                00 // Overview
              </Link>
              <Link
                href="/#about"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                01 // About Me
              </Link>
              <Link
                href="/#services"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                02 // What I Offer
              </Link>
              <Link
                href="/#projects"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                03 // Projects
              </Link>
              <Link
                href="/#experience"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                04 // Experience
              </Link>
              <Link
                href="/#education"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                05 // Education
              </Link>
              <Link
                href="/#skills"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                06 // Skills &amp; Stack
              </Link>
              <Link
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
              >
                07 // Get In Touch
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs text-[var(--accent)] font-semibold"
              >
                Technical Blog &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
