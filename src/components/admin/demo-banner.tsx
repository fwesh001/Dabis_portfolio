'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function DemoBanner() {
  const isConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  if (isConfigured) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs font-mono text-amber-400 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Demo Fallback Mode: Supabase environment variables are not yet configured. Displaying local seed fallback data.</span>
      </div>
      <span className="text-[10px] text-zinc-500 hidden sm:inline">seed-data.ts</span>
    </div>
  );
}
