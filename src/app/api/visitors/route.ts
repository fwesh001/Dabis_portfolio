import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ count: 1 });
    }

    const { data, error } = await supabase
      .from('portfolio_site_profile')
      .select('visitor_count')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return NextResponse.json({ count: 1 });
    }

    return NextResponse.json({ count: Number(data.visitor_count) || 1 });
  } catch {
    return NextResponse.json({ count: 1 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ count: 1 });
    }

    const { data, error } = await supabase.rpc('increment_visitor_count');

    if (error || data === null || data === undefined) {
      // Fallback to read-only count
      const { data: fallback } = await supabase
        .from('portfolio_site_profile')
        .select('visitor_count')
        .eq('id', 1)
        .single();
      return NextResponse.json({ count: Number(fallback?.visitor_count) || 1 });
    }

    return NextResponse.json({ count: Number(data) || 1 });
  } catch {
    return NextResponse.json({ count: 1 });
  }
}
