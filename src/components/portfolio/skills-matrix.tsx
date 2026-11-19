'use client';

import React from 'react';
import { Code, Database, Cloud, Layers } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { renderServiceIcon } from '@/lib/service-icons';
import type { SkillGroup } from '@/lib/types';

interface SkillsMatrixProps {
  skillGroups: SkillGroup[];
}

export function SkillsMatrix({ skillGroups }: SkillsMatrixProps) {
  const getIconForCategory = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('lang')) return Code;
    if (c.includes('distrib') || c.includes('data')) return Database;
    if (c.includes('cloud') || c.includes('devops')) return Cloud;
    return Layers;
  };

  return (
    <section id="skills" className="space-y-6 pt-6">
      <ScrollReveal variant="fade-up">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
          <SectionHeading number="06" title="Skills & Stack" />
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillGroups.map((group, idx) => {
          const FallbackIcon = getIconForCategory(group.category);
          return (
            <ScrollReveal key={group.id} variant="fade-up" delay={idx * 80} className="h-full">
              <div className="h-full p-5 rounded-3xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-[var(--accent)]/60 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="text-xs font-mono font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  {group.icon ? (
                    renderServiceIcon(group.icon, 'w-4 h-4 text-[var(--accent)] flex-shrink-0')
                  ) : (
                    <FallbackIcon className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                  )}
                  <span>{group.category}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                  {group.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm hover:border-[var(--accent)] hover:text-zinc-950 dark:hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
