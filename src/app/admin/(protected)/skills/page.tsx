import React from 'react';
import { getSkillGroups } from '@/lib/queries';
import { SkillsView } from '@/components/admin/skills-view';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const skillGroups = await getSkillGroups();

  return <SkillsView initialSkillGroups={skillGroups} />;
}
