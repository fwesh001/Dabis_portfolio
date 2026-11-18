'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, BookOpen, Pin } from 'lucide-react';
import type { BlogPost } from '@/lib/types';

interface BlogIndexViewProps {
  initialPosts: BlogPost[];
}

export function BlogIndexView({ initialPosts }: BlogIndexViewProps) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const pinnedPosts = useMemo(() => initialPosts.filter((p) => p.pinned), [initialPosts]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ['all', ...Array.from(set)];
  }, [initialPosts]);

  const isFiltering = Boolean(query.trim()) || selectedTag !== 'all';

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Avoid duplicating pinned posts below while not actively searching/filtering
      if (!isFiltering && post.pinned) return false;

      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);
      const q = query.toLowerCase();
      const matchesQuery =
        !query.trim() ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesTag && matchesQuery;
    });
  }, [initialPosts, selectedTag, query, isFiltering]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-24 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Engineering Notes &amp; Articles
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Deep dives on software engineering, distributed backends, cross-platform apps, and hardware systems.
        </p>
      </div>

      {/* Pinned Article(s) Spotlight — Displays ABOVE Search & Filter */}
      {pinnedPosts.length > 0 && (
        <div className="space-y-4">
          {pinnedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-3xl bg-white/85 dark:bg-zinc-900/70 backdrop-blur-sm border-2 border-[var(--accent)]/40 hover:border-[var(--accent)] shadow-lg overflow-hidden transition-all group"
            >
              {post.cover_image && (
                <div className="w-full h-52 sm:h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30 font-semibold text-[11px]">
                      <Pin className="w-3 h-3" />
                      <span>Pinned</span>
                    </span>
                    <span className="text-zinc-500">
                      {post.published_at
                        ? new Date(post.published_at).toISOString().split('T')[0].replace(/-/g, '.')
                        : 'Draft'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
                    {post.reading_time} min read
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-white group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-mono font-semibold text-[var(--accent)] flex items-center gap-1">
                    <span>Read Featured</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Search & Tag Filter Bar */}
      <div className="space-y-3 border-y border-zinc-200 dark:border-zinc-800 py-6">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles by title, technology, or topic..."
            className="w-full bg-white/80 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl transition-all capitalize whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-zinc-900 dark:bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 space-y-2">
            <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
            <div className="text-sm font-semibold text-zinc-900 dark:text-white">No articles found</div>
            <div className="text-xs text-zinc-500 font-mono">
              {isFiltering ? 'Try adjusting your search query or tag filter.' : 'More articles coming soon.'}
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block rounded-3xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 hover:border-[var(--accent)]/60 overflow-hidden transition-all group"
            >
              {post.cover_image && (
                <div className="w-full h-48 sm:h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    {post.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-semibold text-[10px]">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toISOString().split('T')[0].replace(/-/g, '.')
                        : 'Draft'}
                    </span>
                    <span>&bull;</span>
                    <span className="text-[var(--accent)] font-semibold">{post.tags[0] || 'Engineering'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 shadow-sm">
                    {post.reading_time} min read
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-mono font-medium text-zinc-900 dark:text-white group-hover:text-[var(--accent)] flex items-center gap-1 transition-colors">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
