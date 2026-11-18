'use client';

import React, { useEffect, useState } from 'react';
import { List, ChevronDown } from 'lucide-react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map(item => document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      let currentId = items[0].id;
      headingElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top <= 140) {
          currentId = el.id;
        }
      });
      setActiveId(currentId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* Mobile Collapsible TOC Accordion */}
      <div className="lg:hidden p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-200"
        >
          <span className="flex items-center gap-2">
            <List className="w-4 h-4 text-[var(--accent)]" /> Table of Contents
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {mobileOpen && (
          <nav className="pt-2 space-y-1 text-xs font-mono text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800/80">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileOpen(false)}
                className={`block py-1.5 transition-colors ${
                  item.level === 3 ? 'pl-4 text-[11px]' : ''
                } ${
                  activeId === item.id
                    ? 'text-[var(--accent)] font-semibold'
                    : 'hover:text-black dark:hover:text-white'
                }`}
              >
                &rarr; {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop Sticky Sidebar TOC */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-6">
          <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-3 font-mono text-xs">
            <div className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <List className="w-4 h-4 text-[var(--accent)]" />
              <span>Table of Contents</span>
            </div>

            <nav className="space-y-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-3">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block transition-all border-l-2 -ml-[13px] pl-3 py-1 leading-snug ${
                    item.level === 3 ? 'pl-5 text-[11px]' : ''
                  } ${
                    activeId === item.id
                      ? 'border-[var(--accent)] text-[var(--accent)] font-semibold'
                      : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
