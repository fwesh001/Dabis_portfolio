'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { renderServiceIcon } from '@/lib/service-icons';
import type { Service } from '@/lib/types';

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="space-y-6 pt-6">
      <ScrollReveal variant="fade-up">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
          <SectionHeading number="02" title="What I Offer" />
        </div>
      </ScrollReveal>

      {/* Minimal Services Grid: Icon, Name, Optional Note */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <ScrollReveal key={service.id} variant="fade-up" delay={idx * 90} className="h-full">
            <div className="h-full p-6 sm:p-7 rounded-3xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 space-y-4 hover:border-[var(--accent)]/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-[var(--accent)] transition-all duration-300">
                {renderServiceIcon(service.icon, 'w-6 h-6 text-[var(--accent)]')}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-950 dark:text-white group-hover:text-[var(--accent)] transition-colors font-sans">
                  {service.title}
                </h3>

                {service.description && service.description.trim().length > 0 && (
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {service.description}
                  </p>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
