import React from 'react';
import { PortfolioView } from '@/components/portfolio/portfolio-view';
import {
  getSiteProfile,
  getServices,
  getProjects,
  getExperiences,
  getEducation,
  getSkillGroups,
  getPosts,
} from '@/lib/queries';

export const revalidate = 3600; // Default ISR revalidation, purged on-demand by Server Actions

export default async function HomePage() {
  const [profile, services, projects, experiences, education, skillGroups, posts] = await Promise.all([
    getSiteProfile(),
    getServices(),
    getProjects(),
    getExperiences(),
    getEducation(),
    getSkillGroups(),
    getPosts(true),
  ]);

  return (
    <PortfolioView
      profile={profile}
      services={services}
      projects={projects}
      experiences={experiences}
      education={education}
      skillGroups={skillGroups}
      latestPosts={posts}
    />
  );
}
