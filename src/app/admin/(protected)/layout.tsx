'use client';

import React from 'react';
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
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { DemoBanner } from '@/components/admin/demo-banner';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  const handleLogout = async () => {
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

  const navLinks = [
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

  return (
    <div className="h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      <div className="flex-shrink-0">
        <DemoBanner />
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sticky Full-Height Desktop Sidebar with Pinned Footer */}
        <aside className="w-64 h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hidden md:flex flex-col flex-shrink-0">
          {/* Pinned Brand Header */}
          <div className="flex-shrink-0 p-4 pb-3 border-b border-zinc-100 dark:border-zinc-900">
            <div className="px-2">
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Olehi Davis CMS</div>
              <div className="text-[10px] font-mono text-zinc-500">v2.0 &bull; Supabase RLS</div>
            </div>
          </div>

          {/* Scrollable Nav Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs font-mono">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
                  <span className="font-medium text-zinc-900 dark:text-white text-[11px] truncate max-w-[110px]">
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
        </aside>

        {/* Dedicated Scrollable Main Content Pane */}
        <main id="admin-main-scroll" className="flex-1 h-full overflow-y-auto p-4 sm:p-8 pb-24 md:pb-8 relative">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation for 390px Viewports */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-1 z-40 text-[10px] font-mono">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-0.5 ${
            pathname === '/admin' ? 'text-[var(--accent)] font-semibold' : 'text-zinc-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </Link>
        <Link
          href="/admin/settings"
          className={`flex flex-col items-center gap-0.5 ${
            pathname === '/admin/settings' ? 'text-[var(--accent)] font-semibold' : 'text-zinc-500'
          }`}
        >
          <UserCog className="w-4 h-4" />
          <span>Profile</span>
        </Link>
        <Link
          href="/admin/services"
          className={`flex flex-col items-center gap-0.5 ${
            pathname === '/admin/services' ? 'text-[var(--accent)] font-semibold' : 'text-zinc-500'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Services</span>
        </Link>
        <Link
          href="/admin/projects"
          className={`flex flex-col items-center gap-0.5 ${
            pathname === '/admin/projects' ? 'text-[var(--accent)] font-semibold' : 'text-zinc-500'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects</span>
        </Link>
        <Link
          href="/admin/blog"
          className={`flex flex-col items-center gap-0.5 ${
            pathname === '/admin/blog' ? 'text-[var(--accent)] font-semibold' : 'text-zinc-500'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Studio</span>
        </Link>
      </nav>
    </div>
  );
}
