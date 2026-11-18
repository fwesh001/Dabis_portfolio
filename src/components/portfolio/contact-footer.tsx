'use client';

import React, { useEffect, useState } from 'react';
import {
  Copy,
  Check,
  Phone,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { SectionHeading } from '@/components/ui/section-heading';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import type { SocialLinks } from '@/lib/types';

interface ContactFooterProps {
  fullName?: string;
  email?: string;
  location?: string;
  socials?: SocialLinks;
  initialVisitorCount?: number;
}

export function ContactFooter({
  fullName = 'Olehi Davis',
  email = 'olehidavis@gmail.com',
  location = 'FCT, Abuja, Nigeria',
  socials,
  initialVisitorCount = 1,
}: ContactFooterProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(initialVisitorCount);

  const contactPhone = socials?.phone || '09099249445';
  const contactEmail = socials?.email || email;
  const contactAddress = location || 'FCT, Abuja, Nigeria';

  const socialItems = [
    {
      name: 'GitHub',
      url: socials?.github || 'https://github.com/18d-shady',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      url: socials?.linkedin || 'https://www.linkedin.com/in/davis-olehi-8777951a0',
      icon: Linkedin,
    },
    {
      name: 'Instagram',
      url: socials?.instagram || 'https://www.instagram.com/olehidavis?igsh=czM3azlhbmtka2R2',
      icon: Instagram,
    },
    ...(socials?.facebook
      ? [{ name: 'Facebook', url: socials.facebook, icon: Facebook }]
      : []),
    ...(socials?.x ? [{ name: 'X / Twitter', url: socials.x, icon: Twitter }] : []),
  ].filter((item) => Boolean(item.url));

  // Sync live visitor counter (server + client deduplicated on a 12-hour window)
  useEffect(() => {
    let active = true;
    const storageKey = 'od_portfolio_visit_ts';
    const windowMs = 12 * 60 * 60 * 1000;

    const syncVisitors = async () => {
      try {
        let withinWindow = false;
        if (typeof window !== 'undefined') {
          try {
            const lastTs = Number(window.localStorage.getItem(storageKey) || '0');
            withinWindow = Number.isFinite(lastTs) && lastTs > 0 && Date.now() - lastTs < windowMs;
          } catch {
            withinWindow = false;
          }
        }

        const res = await fetch('/api/visitors', {
          method: withinWindow ? 'GET' : 'POST',
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (active && typeof data?.count === 'number') {
          setVisitorCount(data.count);
        }
        if (!withinWindow && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(storageKey, String(Date.now()));
          } catch {
            // Ignore private-mode storage restrictions; server still enforces 12h dedup
          }
        }
      } catch {
        // Keep initial SSR count silently
      }
    };

    syncVisitors();
    return () => {
      active = false;
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    toast.success(`Copied email (${contactEmail}) to clipboard`);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const displayYear = Math.max(2026, new Date().getFullYear());
  const outlineTitle = fullName.toUpperCase();

  return (
    <footer id="contact" className="border-t border-zinc-200 dark:border-zinc-800/80 pt-14 pb-24 md:pb-10 space-y-14">
      {/* Section Header */}
      <ScrollReveal variant="fade-up">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
          <SectionHeading number="07" title="Get In Touch" />
        </div>
      </ScrollReveal>

      {/* Two-Sided Contact Flex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Let's Work Together & Contact Details */}
        <ScrollReveal variant="fade-right" className="space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
              Let&apos;s Work Together
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] font-semibold">
              Contact Me :
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone */}
            <a
              href={`tel:${contactPhone.replace(/\s+/g, '')}`}
              className="group flex items-start gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-[var(--accent)] transition-colors">
                <Phone className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Phone
                </div>
                <div className="text-sm sm:text-base font-mono font-semibold text-zinc-900 dark:text-white group-hover:text-[var(--accent)] transition-colors">
                  {contactPhone}
                </div>
              </div>
            </a>

            {/* Email */}
            <div className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)] transition-all">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-start gap-4 min-w-0 flex-1"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-[var(--accent)] transition-colors">
                  <Mail className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                    Email
                  </div>
                  <div className="text-sm sm:text-base font-mono font-semibold text-zinc-900 dark:text-white group-hover:text-[var(--accent)] transition-colors truncate">
                    {contactEmail}
                  </div>
                </div>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                title="Copy email"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors flex-shrink-0"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  Address
                </div>
                <div className="text-sm sm:text-base font-mono font-semibold text-zinc-900 dark:text-white">
                  {contactAddress}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Right Column: Socials List */}
        <ScrollReveal variant="fade-left" delay={100} className="space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-sans">
              Socials
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500">
              Connect Online
            </p>
          </div>

          <div className="space-y-3">
            {socialItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)] hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:border-[var(--accent)] transition-colors">
                      <Icon className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-zinc-950 dark:text-white group-hover:text-[var(--accent)] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate">
                        {item.url}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                </a>
              );
            })}
          </div>
        </ScrollReveal>
      </div>

      {/* Full-Width Outlined Cut-Half Display Signature + Bottom Meta */}
      <div className="pt-8 space-y-4">
        <ScrollReveal variant="fade-up">
          <div
            aria-hidden="true"
            className="w-full overflow-hidden select-none footer-cut-fade"
          >
            {/* SVG renders exact edge-to-edge outlined uppercase letters cut off cleanly at half height */}
            <svg
              viewBox="0 0 1200 108"
              className="w-full h-auto block text-zinc-900/40 dark:text-zinc-100/35"
              preserveAspectRatio="xMidYMin meet"
            >
              <text
                x="600"
                y="148"
                textAnchor="middle"
                textLength="1180"
                lengthAdjust="spacingAndGlyphs"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                className="font-sans font-black uppercase tracking-tight"
                style={{ fontSize: '175px' }}
              >
                {outlineTitle}
              </text>
            </svg>
          </div>
        </ScrollReveal>

        {/* Bottom Footer Bar: Copyright Left | Visitor Count Right */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-xs font-mono text-zinc-500">
          <div>&copy; {displayYear} {fullName}</div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="tabular-nums font-semibold">
              {visitorCount.toLocaleString()}
            </span>
            <span className="text-zinc-500">
              {visitorCount === 1 ? 'Visitor' : 'Visitors'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
