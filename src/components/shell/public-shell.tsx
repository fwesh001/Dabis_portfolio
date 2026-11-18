'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import { CustomCursor } from './custom-cursor';
import { CustomContextMenu } from './custom-context-menu';
import { CommandPalette } from './command-palette';
import { MobileQuickSheet } from './mobile-quick-sheet';
import { ResumeModal } from '../portfolio/resume-modal';
import { BackToTop } from '../ui/back-to-top';
import { applyAccentToDocument } from '@/lib/accent';
import type { SiteProfile } from '@/lib/types';

interface PublicShellProps {
  children: React.ReactNode;
  profile?: SiteProfile | null;
}

export function PublicShell({ children, profile }: PublicShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  useEffect(() => {
    if (profile?.accent_color) {
      applyAccentToDocument(profile.accent_color);
    }
  }, [profile?.accent_color]);

  const email = profile?.socials?.email || 'olehidavis@gmail.com';
  const resumeUrl = profile?.resume_url;

  return (
    <div className="min-h-screen bg-dot-grid overflow-x-clip">
      <CustomCursor />

      <CustomContextMenu
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        email={email}
        githubUrl={profile?.socials?.github}
      />

      <Navbar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenResume={() => setResumeModalOpen(true)}
        availableForWork={profile?.available_for_work ?? true}
      />

      <main className="min-h-screen overflow-x-clip">
        {children}
      </main>

      <BackToTop />

      <MobileQuickSheet
        onOpenResume={() => setResumeModalOpen(true)}
        email={email}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        resumeMd={profile?.resume_md}
        resumeUrl={resumeUrl}
        fullName={profile?.full_name}
      />
    </div>
  );
}
