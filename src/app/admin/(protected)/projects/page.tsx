import React from 'react';
import { getProjects } from '@/lib/queries';
import { ProjectsView } from '@/components/admin/projects-view';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return <ProjectsView initialProjects={projects} />;
}
