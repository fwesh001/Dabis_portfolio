'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  UserCog,
  Wrench,
  FolderGit2,
  Briefcase,
  GraduationCap,
  FileText,
  Layers,
  Edit3,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { DemoBanner } from '@/components/admin/demo-banner';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Site Profile', icon: UserCog },
  { href: '/admin/resume', label: 'Resume / CV', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/projects', label: 'Projects CRUD', icon: FolderGit2 },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/skills', label: 'Skills Matrix', icon: Layers },
  { href: '/admin/blog', label: 'Blog Studio', icon: Edit3 },
  { href: '/admin/security', label: 'Security', icon: ShieldCheck },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer automatically on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
      toast.success('Signed out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const activeNavItem = NAV_LINKS.find((item) => item.href === pathname);

  const renderSidebarContent = (isMobileDrawer = false) => (
    <>
      {/* Pinned Brand Header */}
      <div className="flex-shrink-0 p-4 pb-3 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
        <div className="px-2">
          <div className="text-sm font-bold text-zinc-900 dark:text-white">Olehi Davis CMS</div>
          <div className="text-[10px] font-mono text-zinc-500">v2.0 &bull; Supabase RLS</div>
        </div>
        {isMobileDrawer && (
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="p-2 rounded-xl text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Scrollable Nav Links */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs font-mono">
        {NAV_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobileDrawer && setMobileMenuOpen(false)}
              className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                isActive
                  ? 'bg-zinc-900 dark:bg-zinc-800 text-white font-semibold shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Always-Visible Sticky Sidebar Footer */}
      <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-3 text-xs bg-white dark:bg-zinc-950">
        <Link
          href="/"
          target="_blank"
          onClick={() => isMobileDrawer && setMobileMenuOpen(false)}
          className="flex items-center justify-between px-2 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white font-mono text-[11px] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>View Live Site</span>
          </span>
          <span className="text-[9px] text-zinc-500">&rarr;</span>
        </Link>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-mono font-bold text-[var(--accent)]">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-zinc-900 dark:text-white text-[11px] truncate max-w-[120px]">
                admin@olehidavis.dev
              </span>
              <span className="text-[9px] font-mono text-[var(--accent)]">Authenticated</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <div className="flex-shrink-0">
        <DemoBanner />
      </div>

      {/* Sticky Mobile Top Bar (< md) */}
      <header className="md:hidden flex-shrink-0 h-14 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open admin navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 -ml-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 hover:border-[var(--accent)]/60 transition-colors flex-shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="text-xs font-bold text-zinc-950 dark:text-white truncate">
              {activeNavItem?.label || 'Admin CMS'}
            </div>
            <div className="text-[10px] font-mono text-zinc-500 truncate">Olehi Davis CMS</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            title="View Live Site"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[var(--accent)]" />
          </Link>
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sticky Full-Height Desktop Sidebar with Pinned Footer */}
        <aside className="w-64 h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hidden md:flex flex-col flex-shrink-0">
          {renderSidebarContent(false)}
        </aside>

        {/* Dedicated Scrollable Main Content Pane */}
        <main id="admin-main-scroll" className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-8 relative">
          {children}
        </main>
      </div>

      {/* Mobile Slide-Out Left Sidebar Drawer (< md) */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-200 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Dark Frosted Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Slide-Out Left Panel */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation menu"
          className={`relative w-72 max-w-[85vw] h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col transition-transform duration-200 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {renderSidebarContent(true)}
        </aside>
      </div>
    </div>
  );
}
