import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ count: 0 });
    }

    const { data, error } = await supabase.rpc('increment_resume_downloads');
    if (error || data === null || data === undefined) {
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: Number(data) || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
