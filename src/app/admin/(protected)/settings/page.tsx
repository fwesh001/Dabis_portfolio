import React from 'react';
import { getSiteProfile } from '@/lib/queries';
import { SettingsView } from '@/components/admin/settings-view';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const profile = await getSiteProfile();

  return <SettingsView initialProfile={profile} />;
}
