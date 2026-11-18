import React from 'react';
import { getServices } from '@/lib/queries';
import { ServicesView } from '@/components/admin/services-view';

export const dynamic = 'force-dynamic';

export default async function AdminServicesPage() {
  const services = await getServices();

  return <ServicesView initialServices={services} />;
}
