import React from 'react';
import {
  getSiteProfile,
  getProjects,
  getPosts,
  getServices,
  getExperiences,
  getEducation,
} from '@/lib/queries';
import { OverviewView } from '@/components/admin/overview-view';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [profile, projects, posts, services, experiences, education] = await Promise.all([
    getSiteProfile(),
    getProjects(),
    getPosts(false),
    getServices(),
    getExperiences(),
    getEducation(),
  ]);

  return (
    <OverviewView
      initialProfile={profile}
      initialProjects={projects}
      initialPosts={posts}
      servicesCount={services.length}
      experiencesCount={experiences.length}
      educationCount={education.length}
    />
  );
}
