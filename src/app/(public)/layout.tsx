import React from 'react';
import { PublicShell } from '@/components/shell/public-shell';
import { getSiteProfile } from '@/lib/queries';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getSiteProfile();

  return (
    <PublicShell profile={profile}>
      {children}
    </PublicShell>
  );
}
