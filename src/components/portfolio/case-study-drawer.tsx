'use client';

import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2 } from 'lucide-react';
import type { Project } from '@/lib/types';

interface CaseStudyDrawerProps {
  project: Project | null;
  onClose: () => void;
}

export function CaseStudyDrawer({ project, onClose }: CaseStudyDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
              Engineering Case Study
            </span>
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mt-1">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tech Stack Pills & Links */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
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
                className="flex items-center gap-1.5 text-[var(--accent)] hover:underline transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live System</span>
              </a>
            )}
          </div>
        </div>

        {/* Case Study Content Body */}
        <div className="space-y-6 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          {/* Summary / Problem */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono flex items-center gap-1.5">
              <span className="text-[var(--accent)]">01 //</span> Problem Statement
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              {project.summary}
            </p>
          </div>

          {/* Markdown Body or Architecture Flow */}
          <div className="space-y-4 prose prose-invert max-w-none text-xs">
            <div className="whitespace-pre-wrap font-sans text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {project.description_md}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
