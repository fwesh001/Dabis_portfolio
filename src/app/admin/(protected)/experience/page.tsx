import React from 'react';
import { getExperiences } from '@/lib/queries';
import { ExperienceView } from '@/components/admin/experience-view';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
  const experiences = await getExperiences();

  return <ExperienceView initialExperiences={experiences} />;
}
