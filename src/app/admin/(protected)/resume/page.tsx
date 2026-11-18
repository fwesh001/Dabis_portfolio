import React from 'react';
import { getSiteProfile } from '@/lib/queries';
import { ResumeView } from '@/components/admin/resume-view';

export const dynamic = 'force-dynamic';

export default async function AdminResumePage() {
  const profile = await getSiteProfile();

  return <ResumeView initialProfile={profile} />;
}
