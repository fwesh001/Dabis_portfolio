import { createHash } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const WINDOW_HOURS = 12;
const WINDOW_SECONDS = WINDOW_HOURS * 60 * 60;
const VISITOR_COOKIE_NAME = 'od_vid_12h';

const BOT_UA_REGEX =
  /bot|crawl|spider|slurp|mediapartners|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|whatsapp|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|telegrambot|embedly|pinterest|vkshare|w3c_validator|preview|curl|wget|python-requests|python-urllib|axios|node-fetch|undici|go-http-client|java\/|okhttp|vercel|datadog|newrelic|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|gptbot|claudebot|anthropic-ai|ccbot/i;

function isBotUserAgent(userAgent: string): boolean {
  const ua = userAgent.trim();
  if (!ua || ua.length < 10) return true;
  return BOT_UA_REGEX.test(ua);
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0]?.trim();
    if (firstIp) return firstIp;
  }
  return (
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-vercel-forwarded-for')?.trim() ||
    'unknown'
  );
}

function buildVisitorHash(ip: string, userAgent: string): string {
  const salt =
    process.env.VISITOR_HASH_SALT ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'od-portfolio-visitor-v1';
  return createHash('sha256')
    .update(`${salt}|${ip}|${userAgent.trim()}`)
    .digest('hex');
}

async function getCurrentCount(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>
): Promise<number> {
  const { data, error } = await supabase
    .from('portfolio_site_profile')
    .select('visitor_count')
    .eq('id', 1)
    .single();

  if (error || !data) return 1;
  return Number(data.visitor_count) || 1;
}

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ count: 1 });
    }

    const count = await getCurrentCount(supabase);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 1 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ count: 1 });
    }

    // 1. Ignore bots, crawlers, link-preview scrapers, and automated clients
    const userAgent = request.headers.get('user-agent') || '';
    if (isBotUserAgent(userAgent)) {
      const count = await getCurrentCount(supabase);
      return NextResponse.json({ count });
    }

    // 2. Exclude signed-in admin sessions from inflating visitor metrics
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const count = await getCurrentCount(supabase);
        return NextResponse.json({ count });
      }
    } catch {
      // Proceed as public visitor if auth check fails
    }

    // 3. Fast-path: already counted via HttpOnly 12-hour cookie
    if (request.cookies.get(VISITOR_COOKIE_NAME)?.value === '1') {
      const count = await getCurrentCount(supabase);
      return NextResponse.json({ count });
    }

    // 4. Server-side 12-hour deduplication via salted SHA-256 visitor ID in Supabase
    const clientIp = getClientIp(request);
    const visitorHash = buildVisitorHash(clientIp, userAgent);

    const { data, error } = await supabase.rpc('record_unique_visitor', {
      p_visitor_hash: visitorHash,
      p_window_hours: WINDOW_HOURS,
    });

    const count =
      !error && data !== null && data !== undefined
        ? Number(data) || 1
        : await getCurrentCount(supabase);

    const response = NextResponse.json({ count });
    response.cookies.set({
      name: VISITOR_COOKIE_NAME,
      value: '1',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: WINDOW_SECONDS,
    });

    return response;
  } catch {
    return NextResponse.json({ count: 1 });
  }
}
