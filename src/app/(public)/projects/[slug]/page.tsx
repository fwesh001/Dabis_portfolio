import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { getProjectBySlug, getProjects } from '@/lib/queries';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';
import { ExpandableImage } from '@/components/ui/image-lightbox';

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8 font-sans">
      {/* Back Link */}
      <Link
        href="/#projects"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects</span>
      </Link>

      {/* Header */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[var(--accent)] font-semibold uppercase tracking-wider">
            Engineering Case Study
          </span>
          {project.status && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              {project.status}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white">
          {project.title}
        </h1>

        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {project.summary}
        </p>

        {/* Tech Stack & Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl text-xs font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[var(--accent)] font-medium hover:underline transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live System</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image Banner */}
      {project.cover_image && (
        <ExpandableImage
          src={project.cover_image}
          alt={project.title}
          containerClassName="w-full rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-100 dark:bg-zinc-950"
          className="w-full max-h-[460px] object-cover"
        />
      )}

      {/* Rendered Markdown Case Study Body */}
      <MarkdownRenderer content={project.description_md || project.summary} />
    </article>
  );
}
