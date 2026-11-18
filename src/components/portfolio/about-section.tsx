'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ExpandableImage } from '@/components/ui/image-lightbox';
import type { SiteProfile } from '@/lib/types';

interface AboutSectionProps {
  profile: SiteProfile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const markdownContent = profile.about_md?.trim();

  if (!markdownContent) return null;

  return (
    <section id="about" className="space-y-6 pt-6">
      <ScrollReveal variant="fade-up">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
          <SectionHeading number="01" title="About Me" />
        </div>
      </ScrollReveal>

      {/* Un-boxed, borderless prose directly on the dot-matrix canvas */}
      <ScrollReveal variant="fade-up" delay={100}>
        <div className="max-w-4xl space-y-4 text-sm sm:text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white pt-2">
                  {children}
                </h3>
              ),
              h2: ({ children }) => (
                <h4 className="text-lg sm:text-xl font-bold text-zinc-950 dark:text-white pt-2">
                  {children}
                </h4>
              ),
              h3: ({ children }) => (
                <h5 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 pt-1">
                  {children}
                </h5>
              ),
              p: ({ children }) => (
                <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-700 dark:text-zinc-300">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 space-y-1.5 text-zinc-700 dark:text-zinc-300">
                  {children}
                </ol>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-zinc-950 dark:text-white">{children}</strong>
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
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-[var(--accent)] pl-4 italic text-zinc-600 dark:text-zinc-400">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-zinc-200/70 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                  {children}
                </code>
              ),
              img: ({ src, alt }) =>
                typeof src === 'string' && src ? (
                  <ExpandableImage
                    src={src}
                    alt={alt || 'About image'}
                    loading="lazy"
                    containerClassName="my-4 w-full max-w-2xl rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-sm"
                    className="w-full h-auto max-h-[420px] object-cover"
                  />
                ) : null,
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </ScrollReveal>
    </section>
  );
}
