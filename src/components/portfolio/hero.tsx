'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  MapPin,
  Github,
  Linkedin,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { TypingEffect } from '@/components/ui/typing-effect';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { ExpandableImage } from '@/components/ui/image-lightbox';
import type { SiteProfile } from '@/lib/types';

interface HeroProps {
  profile: SiteProfile;
  onOpenResume?: () => void;
}

export function Hero({ profile, onOpenResume }: HeroProps) {
  const copyEmail = () => {
    const email = profile.socials.email || 'olehidavis@gmail.com';
    navigator.clipboard.writeText(email);
    toast.success(`Copied email (${email}) to clipboard`);
  };

  const typingWords =
    profile.typer_words && profile.typer_words.length > 0
      ? profile.typer_words
      : ['Web Developer', 'Desktop & Mobile App Developer'];

  const typingSpeed = profile.typer_speed || 75;
  const pauseDuration = profile.typer_pause || 2000;

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between pt-8 sm:pt-12 pb-6"
    >
      {/* Wide subtle radial accent spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl h-80 rounded-full blur-3xl opacity-[0.10] dark:opacity-[0.14]"
        style={{ backgroundColor: 'var(--accent)' }}
      />

      {/* Centered Stage Content */}
      <div className="my-auto py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-14 relative z-10">
          {/* Left Column: Availability, Headline, Typer, CTAs, Socials */}
          <ScrollReveal variant="fade-right" className="flex-1 w-full space-y-6">
            {profile.available_for_work && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-300 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[var(--accent)]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
                </span>
                <span className="font-semibold text-[var(--accent)]">Available for work</span>
              </div>
            )}

            {/* Main Headline & Half-Scale Dynamic Typing Effect */}
            <div className="space-y-2.5">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 dark:text-white leading-[1.1]">
                {profile.headline}
              </h1>

              <div className="min-h-[1.75rem] sm:min-h-[2.25rem] md:min-h-[2.5rem] flex items-center">
                <TypingEffect
                  words={typingWords}
                  typingSpeed={typingSpeed}
                  deletingSpeed={Math.max(25, Math.round(typingSpeed / 2))}
                  pauseDuration={pauseDuration}
                  className="text-base sm:text-2xl md:text-3xl tracking-tight"
                  cursorClassName="w-2.5 h-5 sm:h-7 md:h-8 ml-1.5"
                />
              </div>

              {profile.subheadline && (
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed pt-2">
                  {profile.subheadline}
                </p>
              )}
            </div>

            {/* Primary Action Buttons: Contact Me & View Resume */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/#contact"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-semibold text-black flex items-center gap-2 shadow-lg hover:opacity-90 hover:-translate-y-0.5 active:scale-95 transition-all"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Me</span>
              </Link>

              <button
                onClick={onOpenResume}
                type="button"
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-medium bg-zinc-100/90 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700/80 flex items-center gap-2 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <FileText className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <span>View Resume</span>
              </button>
            </div>

            {/* Location & Social Badges below CTA buttons */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex items-center gap-1.5 bg-zinc-100/90 dark:bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{profile.location}</span>
              </div>

              {profile.socials.phone && (
                <a
                  href={`tel:${profile.socials.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-1.5 bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{profile.socials.phone}</span>
                </a>
              )}

              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}

              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}

              <button
                onClick={copyEmail}
                type="button"
                className="flex items-center gap-1.5 bg-zinc-100/90 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shadow-sm"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{profile.socials.email || 'olehidavis@gmail.com'}</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Circular Enlarged Avatar Container (After text on mobile, right side on lg+) */}
          <ScrollReveal
            variant="scale-in"
            delay={120}
            className="w-full lg:w-auto flex-shrink-0 flex items-center justify-center lg:justify-end self-center pt-2 lg:pt-0"
          >
            <div className="relative group">
              <div
                className="absolute -inset-2 rounded-full opacity-20 group-hover:opacity-40 blur-2xl transition duration-500"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 lg:w-[340px] lg:h-[340px] rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 group-hover:border-[var(--accent)]/60 p-2.5 shadow-2xl overflow-hidden transition-colors duration-500">
                {profile.avatar_url ? (
                  <ExpandableImage
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    showExpandIcon={false}
                    containerClassName="relative w-full h-full rounded-full overflow-hidden"
                  >
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </ExpandableImage>
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-3xl text-[var(--accent)] shadow-md">
                      OD
                    </div>
                    <div className="text-sm font-mono font-bold text-zinc-900 dark:text-white">
                      {profile.full_name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Blueprint Horizon Divider with Registration Ticks & Animated Scroll Cue */}
      <div className="relative pt-10">
        <div className="relative flex items-center justify-between border-b border-zinc-300/80 dark:border-zinc-800 pb-4">
          <span className="font-mono text-xs text-[var(--accent)] select-none">+</span>

          <Link
            href="/#about"
            className="group inline-flex flex-col items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-[var(--accent)] transition-colors"
          >
            <span>Scroll to explore</span>
            <span className="w-px h-4 bg-gradient-to-b from-transparent to-[var(--accent)]" />
            <ChevronDown className="w-3.5 h-3.5 text-[var(--accent)] animate-bounce" />
          </Link>

          <span className="font-mono text-xs text-[var(--accent)] select-none">+</span>
        </div>
      </div>
    </section>
  );
}
