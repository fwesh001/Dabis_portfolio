'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, FileText, ArrowUpRight, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenResume?: () => void;
  availableForWork?: boolean;
}

export function Navbar({ onOpenCommandPalette, onOpenResume, availableForWork = true }: NavbarProps) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isBlog = pathname?.startsWith('/blog');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/90 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Mobile: justify-between (Option A right-aligned utility controls) | Desktop: 3-column Technical Grid */}
        <div className="flex items-center justify-between md:grid md:grid-cols-[auto_1fr_auto] h-16 md:divide-x md:divide-zinc-200 md:dark:divide-zinc-800/80">
          {/* Grid Cell 1: Monogram & Name (No subtitle) */}
          <div className="md:pr-6 flex items-center flex-shrink-0">
            <Link href="/#hero" className="flex items-center space-x-2.5 sm:space-x-3 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700/80 flex items-center justify-center font-mono font-bold text-xs tracking-wider text-zinc-900 dark:text-white group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all shadow-sm">
                OD
              </div>
              <span className="font-semibold text-sm text-zinc-950 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors whitespace-nowrap">
                Olehi Davis
              </span>
            </Link>
          </div>

          {/* Grid Cell 2: Navigation Links (Desktop only; clean spacer on /blog) */}
          <div className="hidden md:flex items-center justify-center px-6 space-x-1 lg:space-x-2 text-xs font-mono">
            {!isBlog && (
              <nav className="flex items-center space-x-1 lg:space-x-2 text-zinc-600 dark:text-zinc-400 font-medium">
                <Link
                  href="/#about"
                  className="px-2.5 py-1.5 rounded-lg hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/#services"
                  className="px-2.5 py-1.5 rounded-lg hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/#projects"
                  className="px-2.5 py-1.5 rounded-lg hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/#experience"
                  className="px-2.5 py-1.5 rounded-lg hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  Experience
                </Link>
                <Link
                  href="/#education"
                  className="px-2.5 py-1.5 rounded-lg hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  Education
                </Link>
                <Link
                  href="/#skills"
                  className="px-2.5 py-1.5 rounded-lg hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  Stack
                </Link>
                <Link
                  href="/#contact"
                  className="px-2.5 py-1.5 rounded-lg hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                >
                  Contact
                </Link>
              </nav>
            )}
          </div>

          {/* Grid Cell 3: Context Switcher & Utility Tools (Right-aligned on mobile & desktop) */}
          <div className="md:pl-6 flex items-center justify-end space-x-2 sm:space-x-3 flex-shrink-0">
            {/* Dynamic Blog / Portfolio Switcher Button */}
            {isBlog ? (
              <Link
                href="/#hero"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700/80 bg-white dark:bg-zinc-900 hover:border-[var(--accent)] text-zinc-900 dark:text-zinc-100 font-mono text-xs font-semibold shadow-sm transition-all group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[var(--accent)] group-hover:-translate-x-0.5 transition-transform" />
                <span>Portfolio</span>
              </Link>
            ) : (
              <Link
                href="/blog"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 hover:border-[var(--accent)] hover:text-black dark:hover:text-white text-zinc-700 dark:text-zinc-300 font-mono text-xs transition-all group shadow-sm"
              >
                <span>Blog</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            )}

            {/* Availability Status Pill (Desktop XL) */}
            {availableForWork && (
              <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--accent)]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
                <span className="font-semibold text-[var(--accent)]">Open to Roles</span>
              </div>
            )}

            {/* ⌘K Trigger Button */}
            <button
              onClick={onOpenCommandPalette}
              type="button"
              className="hidden sm:flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-200 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all"
              title="Open Command Palette (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
              <kbd className="bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">⌘K</kbd>
            </button>

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                type="button"
                className="p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                title="Toggle Theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-700" />
                )}
              </button>
            )}

            {/* Resume Modal Trigger */}
            <button
              onClick={onOpenResume}
              type="button"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-black dark:hover:bg-white flex items-center gap-1.5 transition-colors shadow-sm"
              title="View Resume"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
