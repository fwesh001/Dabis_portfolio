'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, ExternalLink, Github } from 'lucide-react';
import { ExpandableImage } from '@/components/ui/image-lightbox';
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
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
                Engineering Case Study
              </span>
              {project.status && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {project.status}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Screenshot */}
        {project.cover_image && (
          <ExpandableImage
            src={project.cover_image}
            alt={project.title}
            containerClassName="w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm"
            className="w-full max-h-72 object-cover"
          />
        )}

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

        {/* Rendered Markdown Case Study Body */}
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans pt-2">
          {project.description_md?.trim() ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-white pt-3">
                    {children}
                  </h3>
                ),
                h2: ({ children }) => (
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white font-mono pt-4 pb-1 border-b border-zinc-200 dark:border-zinc-800/80">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h4 className="text-sm font-bold text-[var(--accent)] font-mono uppercase tracking-wide pt-3">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-2 text-zinc-600 dark:text-zinc-400">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-zinc-950 dark:text-white">
                    {children}
                  </strong>
                ),
                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto font-mono text-xs text-zinc-200 leading-relaxed">
                    {children}
                  </pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
                  >
                    {children}
                  </a>
                ),
                img: ({ src, alt }) =>
                  typeof src === 'string' && src ? (
                    <ExpandableImage
                      src={src}
                      alt={alt || project.title}
                      loading="lazy"
                      containerClassName="my-4 w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  ) : null,
              }}
            >
              {project.description_md}
            </ReactMarkdown>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">{project.summary}</p>
          )}
        </div>
      </div>
    </div>
  );
}
