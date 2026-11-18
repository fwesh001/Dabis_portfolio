'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, ExternalLink, Github, FolderGit2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ExpandableImage } from '@/components/ui/image-lightbox';
import type { Project } from '@/lib/types';

interface ProjectGridProps {
  projects: Project[];
  onOpenCaseStudy?: (project: Project) => void;
}

function getStatusBadgeStyle(status?: string) {
  const s = (status || 'Live').toLowerCase();
  if (s.includes('live') || s.includes('prod') || s.includes('shipped') || s.includes('complete')) {
    return {
      dot: 'bg-emerald-500',
      pulse: true,
      badge: 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    };
  }
  if (s.includes('beta') || s.includes('stag') || s.includes('rc') || s.includes('preview')) {
    return {
      dot: 'bg-amber-500',
      pulse: true,
      badge: 'text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10',
    };
  }
  if (s.includes('dev') || s.includes('alpha') || s.includes('wip') || s.includes('proto') || s.includes('build')) {
    return {
      dot: 'bg-sky-500',
      pulse: true,
      badge: 'text-sky-700 dark:text-sky-400 border-sky-500/30 bg-sky-500/10',
    };
  }
  if (s.includes('arch') || s.includes('pause') || s.includes('deprec') || s.includes('maint')) {
    return {
      dot: 'bg-zinc-400',
      pulse: false,
      badge: 'text-zinc-600 dark:text-zinc-400 border-zinc-400/30 bg-zinc-500/10',
    };
  }
  return {
    dot: 'bg-[var(--accent)]',
    pulse: false,
    badge: 'text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950',
  };
}

export function ProjectGrid({ projects, onOpenCaseStudy }: ProjectGridProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'desktop' | 'mobile' | 'electronics'>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    const matchAny = (p: Project, keywords: string[]) => {
      const haystack = [p.title, p.summary, ...p.tech_stack].join(' ').toLowerCase();
      return keywords.some((kw) => haystack.includes(kw));
    };
    if (activeFilter === 'web') {
      return projects.filter((p) => matchAny(p, ['web', 'next.js', 'react', 'pos', 'inventory', 'supabase']));
    }
    if (activeFilter === 'desktop') {
      return projects.filter((p) => matchAny(p, ['desktop', 'electron', 'tauri', 'java', 'bece']));
    }
    if (activeFilter === 'mobile') {
      return projects.filter((p) => matchAny(p, ['android', 'mobile', 'ios', 'flutter', 'react native', 'chatbot', 'kotlin']));
    }
    if (activeFilter === 'electronics') {
      return projects.filter((p) => matchAny(p, ['electronic', 'esp8266', 'esp32', 'nodemcu', 'tft', 'embedded', 'iot', 'microcontroller']));
    }
    return projects;
  }, [projects, activeFilter]);

  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, 4);

  return (
    <section id="projects" className="space-y-6 pt-6">
      <ScrollReveal variant="fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
          <SectionHeading number="03" title="Projects" />

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
            {(
              [
                { id: 'all', label: `All (${projects.length})` },
                { id: 'web', label: 'Web' },
                { id: 'desktop', label: 'Desktop' },
                { id: 'mobile', label: 'Mobile' },
                { id: 'electronics', label: 'Electronics' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setShowAll(false);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-zinc-900 dark:bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleProjects.map((project, idx) => {
          const statusLabel = project.status?.trim() || 'Live';
          const statusStyle = getStatusBadgeStyle(statusLabel);

          return (
            <ScrollReveal key={project.id} variant="scale-in" delay={(idx % 4) * 80} className="h-full">
              <div className="h-full p-6 rounded-3xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-6 hover:border-[var(--accent)]/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                <div className="space-y-4">
                  {/* Project Card Image Banner */}
                  {project.cover_image ? (
                    <ExpandableImage
                      src={project.cover_image}
                      alt={project.title}
                      loading="lazy"
                      containerClassName="w-full h-44 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 group-hover:border-[var(--accent)]/50 transition-colors"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-44 rounded-2xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden flex items-center justify-center p-4">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)/0.12,transparent_70%)]" />
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:12px_12px]" />
                      <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-[var(--accent)] shadow-inner group-hover:scale-105 transition-transform">
                          <FolderGit2 className="w-5 h-5 text-[var(--accent)]" />
                        </div>
                        <span className="text-xs font-mono text-zinc-300 font-semibold tracking-wide">
                          {project.title.split('—')[0]?.trim() || project.title}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Architecture Blueprint // {project.tech_stack[0]}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
                        SYSTEM_PREVIEW
                      </div>
                    </div>
                  )}

                  {/* Category & Dynamic Development Status / Stage Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-[var(--accent)] font-semibold">
                        {project.tech_stack[0] || 'Engineering'}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border shadow-sm ${statusStyle.badge}`}
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          {statusStyle.pulse && (
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusStyle.dot}`}
                            />
                          )}
                          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusStyle.dot}`} />
                        </span>
                        <span>{statusLabel}</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-950 dark:text-white group-hover:text-[var(--accent)] transition-colors font-sans">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech_stack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800/60">
                  <div className="flex items-center space-x-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenCaseStudy?.(project)}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono font-medium text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700/80 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <span>Deep Case Study</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* View More / Show Less Toggle Button */}
      {filteredProjects.length > 4 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 transition-all shadow-sm active:scale-95 group"
          >
            <span>
              {showAll
                ? 'Show Fewer Projects'
                : `View All Projects (${filteredProjects.length} Total)`}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--accent)] transition-transform duration-200 ${
                showAll ? 'rotate-180' : 'group-hover:translate-y-0.5'
              }`}
            />
          </button>
        </div>
      )}
    </section>
  );
}
