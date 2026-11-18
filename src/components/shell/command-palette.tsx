'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search, FolderGit2, BookOpen, SunMoon, Download, Mail, Github, Layers, User } from 'lucide-react';
import { toast } from 'sonner';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResume?: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenResume }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const items = useMemo(() => [
    {
      category: 'Navigation',
      label: 'Hero & Bio Overview',
      icon: User,
      action: () => { router.push('/#hero'); onClose(); }
    },
    {
      category: 'Navigation',
      label: 'Architecture Bento Grid',
      icon: Layers,
      action: () => { router.push('/#bento'); onClose(); }
    },
    {
      category: 'Navigation',
      label: 'Featured Projects',
      icon: FolderGit2,
      action: () => { router.push('/#projects'); onClose(); }
    },
    {
      category: 'Navigation',
      label: 'Technical Blog Articles',
      icon: BookOpen,
      action: () => { router.push('/blog'); onClose(); }
    },
    {
      category: 'Quick Actions',
      label: 'Copy Senior Engineer Email',
      icon: Mail,
      action: () => {
        navigator.clipboard.writeText('admin@olehidavis.dev');
        toast.success('Email copied to clipboard (admin@olehidavis.dev)');
        onClose();
      }
    },
    {
      category: 'Quick Actions',
      label: 'View / Download Resume (PDF)',
      icon: Download,
      action: () => {
        onClose();
        onOpenResume?.();
      }
    },
    {
      category: 'Quick Actions',
      label: 'Toggle Dark / Light Theme',
      icon: SunMoon,
      action: () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
        toast.info(`Theme switched to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'}`);
        onClose();
      }
    },
    {
      category: 'External',
      label: 'GitHub Profile (18d-shady)',
      icon: Github,
      action: () => {
        window.open('https://github.com/18d-shady', '_blank');
        onClose();
      }
    }
  ], [router, onClose, onOpenResume, setTheme, resolvedTheme]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item => item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [items, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-zinc-950 dark:bg-zinc-950 bg-white border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800 h-13">
          <Search className="w-4 h-4 text-zinc-400 mr-2.5" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none py-3"
          />
          <kbd className="text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 text-xs font-medium">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500 font-mono">No matching commands or sections found.</div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full px-3 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[var(--accent)]" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{item.category}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
