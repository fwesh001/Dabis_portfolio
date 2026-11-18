import { NextResponse } from 'next/server';
import { getPosts, getSiteProfile } from '@/lib/queries';

export async function GET() {
  const [profile, posts] = await Promise.all([
    getSiteProfile(),
    getPosts(true),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://olehidavis.dev';

  const itemsXml = posts
    .map((post) => {
      const pubDate = post.published_at ? new Date(post.published_at).toUTCString() : new Date().toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join('')}
    </item>`;
    })
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${profile.full_name} — Technical Blog</title>
    <link>${siteUrl}/blog</link>
    <description>${profile.headline}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
