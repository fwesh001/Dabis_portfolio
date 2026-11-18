import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, Share2, ArrowRight } from 'lucide-react';
import { getPostBySlug, getPosts } from '@/lib/queries';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { TableOfContents, type TocItem } from '@/components/blog/table-of-contents';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';
import { ExpandableImage } from '@/components/ui/image-lightbox';

export async function generateStaticParams() {
  const posts = await getPosts(true);
  return posts.map((p) => ({ slug: p.slug }));
}

function extractTocItems(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.*)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    // Clean markdown bold or code ticks
    const text = rawText.replace(/[*`_]/g, '');
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    items.push({ id, text, level });
  }

  return items;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const tocItems = extractTocItems(post.content_md);

  return (
    <>
      <ReadingProgress />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Column (8 cols on lg) */}
          <article className="lg:col-span-8 space-y-10">
            {/* Back Link & Header */}
            <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to all articles</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.published_at
                    ? new Date(post.published_at).toISOString().split('T')[0].replace(/-/g, '.')
                    : 'Draft'}
                </span>
                <span>&bull;</span>
                <span className="text-[var(--accent)] font-semibold">{post.tags[0] || 'Distributed Systems'}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.reading_time} min read
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white leading-tight">
                {post.title}
              </h1>

              {/* Author Byline */}
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-[var(--accent)] shadow-sm">
                  OD
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-200">Olehi Davis</div>
                  <div className="text-zinc-500 font-mono text-[11px]">Software &amp; Electronics Engineer</div>
                </div>
              </div>
            </div>

            {/* Article Cover Image Banner */}
            {post.cover_image && (
              <ExpandableImage
                src={post.cover_image}
                alt={post.title}
                containerClassName="w-full max-h-[420px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg bg-zinc-100 dark:bg-zinc-950"
                className="w-full h-full object-cover"
              />
            )}

            {/* Mobile Collapsible TOC Accordion */}
            <TableOfContents items={tocItems} />

            {/* Markdown Body with Shiki Code Blocks */}
            <MarkdownRenderer content={post.content_md} />

            {/* Author Bio Footer */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-base text-[var(--accent)] shadow-sm flex-shrink-0">
                OD
              </div>
              <div className="space-y-1">
                <div className="font-bold text-zinc-950 dark:text-white text-sm">Olehi Davis</div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Senior Software Engineer specializing in distributed backend systems, event streaming architectures, and cloud platform infrastructure.
                </p>
              </div>
            </div>
          </article>

          {/* Right Sticky Sidebar (Desktop TOC) (4 cols on lg) */}
          <div className="hidden lg:block lg:col-span-4">
            <TableOfContents items={tocItems} />
          </div>
        </div>
      </main>
    </>
  );
}
