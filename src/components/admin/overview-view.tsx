'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  FileText,
  Users,
  Download,
  Plus,
  Edit3,
  CheckCircle2,
  Database,
  HardDrive,
  RefreshCw,
  Sparkles,
  Wrench,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';
import { updateSiteProfileAction } from '@/lib/actions/admin-actions';
import type { SiteProfile, Project, BlogPost } from '@/lib/types';

interface OverviewViewProps {
  initialProfile: SiteProfile;
  initialProjects: Project[];
  initialPosts: BlogPost[];
  servicesCount?: number;
  experiencesCount?: number;
  educationCount?: number;
}

export function OverviewView({
  initialProfile,
  initialProjects,
  initialPosts,
  servicesCount = 0,
  experiencesCount = 0,
  educationCount = 0,
}: OverviewViewProps) {
  const [profile, setProfile] = useState<SiteProfile>(initialProfile);
  const [isUpdatingAvail, setIsUpdatingAvail] = useState(false);

  const liveProjectsCount = initialProjects.filter((p) =>
    (p.status || 'Live').toLowerCase().includes('live')
  ).length;
  const publishedPostsCount = initialPosts.filter((p) => p.published).length;
  const draftPostsCount = initialPosts.length - publishedPostsCount;
  const pinnedPostsCount = initialPosts.filter((p) => p.pinned).length;
  const visitorCount = profile.visitor_count ?? 0;
  const resumeDownloads = profile.resume_downloads ?? 0;
  const hasDynamicResume = Boolean(profile.resume_md && profile.resume_md.trim().length > 0);

  const handleToggleAvailability = async () => {
    setIsUpdatingAvail(true);
    const newStatus = !profile.available_for_work;
    setProfile((prev) => ({ ...prev, available_for_work: newStatus }));

    try {
      await updateSiteProfileAction({ available_for_work: newStatus });
      toast.success(
        newStatus
          ? 'Availability set to "Open to Opportunities"'
          : 'Availability set to "Unavailable / Busy"'
      );
    } catch (err: unknown) {
      setProfile((prev) => ({ ...prev, available_for_work: !newStatus }));
      toast.error(err instanceof Error ? err.message : 'Failed to update availability status');
    } finally {
      setIsUpdatingAvail(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">System Overview</h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Admin CMS Status &bull; Live Supabase Telemetry &bull; {profile.full_name}
          </p>
        </div>

        {/* Live availability toggle */}
        <div className="flex items-center space-x-3 bg-white dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono shadow-sm">
          <span className="text-zinc-500">Public Status:</span>
          <button
            type="button"
            disabled={isUpdatingAvail}
            onClick={handleToggleAvailability}
            className={`w-10 h-5 rounded-full relative transition-colors p-0.5 flex items-center ${
              profile.available_for_work ? 'bg-[var(--accent)]' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
            title="Toggle Availability Status"
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                profile.available_for_work ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`font-semibold ${
              profile.available_for_work ? 'text-[var(--accent)]' : 'text-zinc-500'
            }`}
          >
            {profile.available_for_work ? 'Open to Work' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Live Metrics Grid (100% real Supabase telemetry) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Total Projects</span>
            <FolderGit2 className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tabular-nums">
            {initialProjects.length}
          </div>
          <div className="text-[10px] font-mono text-[var(--accent)]">
            {liveProjectsCount} Live &bull; {initialProjects.length - liveProjectsCount} Other Stage
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Published Posts</span>
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tabular-nums">
            {publishedPostsCount}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            {draftPostsCount} Draft{draftPostsCount === 1 ? '' : 's'} &bull; {pinnedPostsCount} Pinned
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Portfolio Visitors</span>
            <Users className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tabular-nums">
            {visitorCount.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[var(--accent)]">Live Supabase counter</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Resume Downloads</span>
            <Download className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-white tabular-nums">
            {resumeDownloads.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[var(--accent)] font-semibold">
            Live PDF export count
          </div>
        </div>
      </div>

      {/* Secondary Live Content Breakdown */}
      <div className="grid grid-cols-3 gap-3 font-mono text-xs">
        <Link
          href="/admin/services"
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Wrench className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Services</span>
          </div>
          <span className="font-bold text-zinc-900 dark:text-white tabular-nums">{servicesCount}</span>
        </Link>
        <Link
          href="/admin/experience"
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <Briefcase className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Experience</span>
          </div>
          <span className="font-bold text-zinc-900 dark:text-white tabular-nums">{experiencesCount}</span>
        </Link>
        <Link
          href="/admin/education"
          className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)] transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Education</span>
          </div>
          <span className="font-bold text-zinc-900 dark:text-white tabular-nums">{educationCount}</span>
        </Link>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/admin/projects"
          className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:text-[var(--accent)] transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">Manage Projects</div>
              <div className="text-[10px] text-zinc-500 font-mono">Stages &amp; ordering</div>
            </div>
          </div>
          <span className="text-zinc-400 group-hover:translate-x-0.5 transition-transform text-xs">&rarr;</span>
        </Link>

        <Link
          href="/admin/blog"
          className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:text-[var(--accent)] transition-colors">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">Write Article</div>
              <div className="text-[10px] text-zinc-500 font-mono">Covers &amp; pinned posts</div>
            </div>
          </div>
          <span className="text-zinc-400 group-hover:translate-x-0.5 transition-transform text-xs">&rarr;</span>
        </Link>

        <Link
          href="/admin/resume"
          className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:text-[var(--accent)] transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-900 dark:text-white">Edit Resume / CV</div>
              <div className="text-[10px] text-zinc-500 font-mono">Auto-generated PDF</div>
            </div>
          </div>
          <span className="text-zinc-400 group-hover:translate-x-0.5 transition-transform text-xs">&rarr;</span>
        </Link>
      </div>

      {/* Infrastructure Telemetry & Status */}
      <div className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 font-mono text-xs space-y-3">
        <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center justify-between">
          <span>Infrastructure Telemetry</span>
          <span className="text-[10px] font-normal text-emerald-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-zinc-600 dark:text-zinc-400">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-zinc-900 dark:text-zinc-200 font-semibold">PostgreSQL (flux)</div>
              <div className="text-[10px] text-zinc-500">Prefix: portfolio_* (7 tables)</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-zinc-900 dark:text-zinc-200 font-semibold">Supabase Storage</div>
              <div className="text-[10px] text-zinc-500">Bucket: portfolio-assets</div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-[var(--accent)]" />
            <div>
              <div className="text-zinc-900 dark:text-zinc-200 font-semibold">Edge Invalidation</div>
              <div className="text-[10px] text-zinc-500">revalidatePath(&apos;/&apos;, &apos;layout&apos;)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Feed (Live DB Summary) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
        <div className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center justify-between">
          <span>Live CMS Status &amp; Telemetry</span>
          <span className="text-[10px] font-normal text-emerald-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Synchronized
          </span>
        </div>
        <div className="space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Profile last updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Live'}</span>
            </div>
            <span className="text-zinc-500 text-[10px]">Accent {profile.accent_color}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Dynamic Resume / CV:{' '}
                {hasDynamicResume ? `${(profile.resume_md || '').length} chars active` : 'Not configured yet'}
              </span>
            </div>
            <Link
              href="/admin/resume"
              className="text-[10px] text-[var(--accent)] hover:underline"
            >
              Open Studio &rarr;
            </Link>
          </div>
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Top ranked project: {initialProjects[0]?.title || 'None'}</span>
            </div>
            <span className="text-zinc-500 text-[10px]">
              Stage: {initialProjects[0]?.status || 'Live'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
