'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import type { Experience } from '@/lib/types';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <section id="experience" className="space-y-6 pt-6">
      <ScrollReveal variant="fade-up">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
          <SectionHeading number="04" title="Experience" />
        </div>
      </ScrollReveal>

      <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
        {experiences.map((exp, idx) => (
          <ScrollReveal key={exp.id} variant="fade-left" delay={idx * 90}>
            <div className="relative pl-8 sm:pl-10 space-y-2 group">
              {/* Timeline bullet indicator */}
              <div
                className={`absolute left-1.5 sm:left-2.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-zinc-50 dark:ring-zinc-950 transition-transform duration-300 group-hover:scale-125 ${
                  idx === 0 ? 'bg-[var(--accent)]' : 'bg-zinc-400 dark:bg-zinc-600 group-hover:bg-[var(--accent)]'
                }`}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white group-hover:text-[var(--accent)] transition-colors">
                  {exp.role}
                </h3>
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  {exp.period}
                </span>
              </div>

              <div className="text-xs font-mono text-[var(--accent)] font-semibold">
                {exp.company_url ? (
                  <a
                    href={exp.company_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
                {exp.location && (
                  <span className="text-zinc-500 dark:text-zinc-400 font-normal">
                    {' '}&bull; {exp.location}
                  </span>
                )}
              </div>

              <ul className="list-disc pl-4 space-y-1.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                {exp.highlights.map((bullet, bIdx) => (
                  <li key={bIdx}>{bullet}</li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
