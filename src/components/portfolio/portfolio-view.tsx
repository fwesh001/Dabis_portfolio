'use client';

import React, { useState } from 'react';
import { Hero } from './hero';
import { AboutSection } from './about-section';
import { ServicesSection } from './services-section';
import { ProjectGrid } from './project-grid';
import { CaseStudyDrawer } from './case-study-drawer';
import { ExperienceTimeline } from './experience-timeline';
import { EducationTimeline } from './education-timeline';
import { SkillsMatrix } from './skills-matrix';
import { ContactFooter } from './contact-footer';
import { ResumeModal } from './resume-modal';
import type { SiteProfile, Service, Project, Experience, Education, SkillGroup, BlogPost } from '@/lib/types';

interface PortfolioViewProps {
  profile: SiteProfile;
  services: Service[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  latestPosts: BlogPost[];
}

export function PortfolioView({
  profile,
  services,
  projects,
  experiences,
  education,
  skillGroups,
}: PortfolioViewProps) {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-24 pb-8">
      <Hero
        profile={profile}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      <AboutSection profile={profile} />

      <ServicesSection services={services} />

      <ProjectGrid
        projects={projects}
        onOpenCaseStudy={(proj) => setSelectedCaseStudy(proj)}
      />

      <ExperienceTimeline experiences={experiences} />

      <EducationTimeline education={education} />

      <SkillsMatrix skillGroups={skillGroups} />

      <ContactFooter
        fullName={profile.full_name}
        email={profile.socials.email}
        location={profile.location}
        socials={profile.socials}
        initialVisitorCount={profile.visitor_count ?? 1}
      />

      <CaseStudyDrawer
        project={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
      />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        resumeMd={profile.resume_md}
        resumeUrl={profile.resume_url}
        fullName={profile.full_name}
      />
    </div>
  );
}
