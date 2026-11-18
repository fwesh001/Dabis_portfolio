import React from 'react';
import { getEducation } from '@/lib/queries';
import { EducationView } from '@/components/admin/education-view';

export const dynamic = 'force-dynamic';

export default async function AdminEducationPage() {
  const education = await getEducation();

  return <EducationView initialEducation={education} />;
}
