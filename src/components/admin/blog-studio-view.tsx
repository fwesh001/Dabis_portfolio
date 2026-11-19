'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Save,
  Trash2,
  Check,
  Loader2,
  Settings,
  Bold,
  Italic,
  Heading2,
  Code2,
  AlertCircle,
  Link2,
  Clock,
  Pin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { saveBlogPostAction, deleteBlogPostAction } from '@/lib/actions/admin-actions';
import { MarkdownRenderer } from '@/components/blog/markdown-renderer';
import { ExpandableImage } from '@/components/ui/image-lightbox';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { ImageUploader } from './image-uploader';
import type { BlogPost } from '@/lib/types';

interface BlogStudioViewProps {
  initialPosts: BlogPost[];
}

export function BlogStudioView({ initialPosts }: BlogStudioViewProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [selectedPostId, setSelectedPostId] = useState<string>(
    initialPosts[0]?.id || 'new'
  );

  const [activeMobileTab, setActiveMobileTab] = useState<'write' | 'preview' | 'settings'>('write');
  const [showDesktopMeta, setShowDesktopMeta] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentPost = useMemo<BlogPost>(() => {
    return (
      posts.find((p) => p.id === selectedPostId) || {
        id: '',
        title: 'Untitled Engineering Post',
        slug: 'untitled-engineering-post',
        excerpt: 'A technical deep-dive into distributed systems and modern web architecture.',
        content_md: `## 01 // Overview\n\nWrite your technical notes here...\n`,
        cover_image: null,
        tags: ['Architecture', 'Web'],
        reading_time: 3,
        published: false,
        pinned: false,
        published_at: null,
      }
    );
  }, [posts, selectedPostId]);

  const [formPost, setFormPost] = useState<BlogPost>(currentPost);

  const handleSelectPost = (id: string) => {
    setSelectedPostId(id);
    const post = posts.find((p) => p.id === id);
    if (post) {
      setFormPost({ ...post, pinned: Boolean(post.pinned) });
    }
  };

  const handleCreateNew = () => {
    const newDraft: BlogPost = {
      id: '',
      title: 'New Technical Post',
      slug: 'new-technical-post-' + Date.now().toString().slice(-4),
      excerpt: 'Brief overview of the technical challenges and architecture decisions.',
      content_md: `## 01 // Introduction\n\nDocumenting our engineering decisions and production telemetry.\n`,
      cover_image: null,
      tags: ['Architecture', 'Performance'],
      reading_time: 3,
      published: false,
      pinned: false,
      published_at: null,
    };
    setSelectedPostId('new');
    setFormPost(newDraft);
    setActiveMobileTab('write');
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = prefix + (selectedText || 'text') + suffix;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormPost((prev) => ({
      ...prev,
      content_md: newContent,
      reading_time: Math.max(1, Math.ceil(newContent.split(/\s+/).length / 200)),
    }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText || 'text').length);
    }, 50);
  };

  const handleSave = async (publishOverride?: boolean) => {
    if (!formPost.title || !formPost.slug) {
      toast.error('Title and Slug are required');
      return;
    }

    setIsSaving(true);
    const isPublishing = publishOverride !== undefined ? publishOverride : formPost.published;
    const payload: Partial<BlogPost> = {
      ...formPost,
      published: isPublishing,
      pinned: Boolean(formPost.pinned),
      published_at: isPublishing
        ? formPost.published_at || new Date().toISOString()
        : formPost.published_at,
      reading_time: Math.max(1, Math.ceil((formPost.content_md || '').split(/\s+/).length / 200)),
    };

    try {
      await saveBlogPostAction(payload);
      toast.success(
        isPublishing
          ? `"${formPost.title}" published live!`
          : `Draft "${formPost.title}" saved successfully!`
      );

      if (formPost.id) {
        setPosts((prev) =>
          prev.map((p) => (p.id === formPost.id ? ({ ...p, ...payload } as BlogPost) : p))
        );
      } else {
        const createdPost = {
          ...payload,
          id: 'temp-' + Date.now(),
        } as BlogPost;
        setPosts((prev) => [createdPost, ...prev]);
        setSelectedPostId(createdPost.id);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!formPost.id) {
      handleCreateNew();
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!formPost.id) return;

    try {
      await deleteBlogPostAction(formPost.id);
      toast.success(`Deleted article "${formPost.title}"`);
      const remaining = posts.filter((p) => p.id !== formPost.id);
      setPosts(remaining);
      if (remaining.length > 0) {
        setSelectedPostId(remaining[0].id);
        setFormPost(remaining[0]);
      } else {
        handleCreateNew();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete post');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl w-full min-w-0 mx-auto flex flex-col">
      {/* Studio Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3 flex-shrink-0 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto min-w-0">
          <select
            value={selectedPostId}
            onChange={(e) => handleSelectPost(e.target.value)}
            className="flex-1 min-w-0 w-full sm:w-auto sm:max-w-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)] truncate shadow-sm"
          >
            {posts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.pinned ? '📌 ' : ''}{p.published ? '🟢' : '⚪'} {p.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleCreateNew}
            className="flex-shrink-0 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Create new draft post"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden md:inline">New Post</span>
          </button>

          {/* Quick Pin Toggle Button */}
          <button
            type="button"
            onClick={() => setFormPost((prev) => ({ ...prev, pinned: !prev.pinned }))}
            className={`flex-shrink-0 px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm ${
              formPost.pinned
                ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)] font-semibold'
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
            title="Pin this article above the blog search bar"
          >
            <Pin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{formPost.pinned ? 'Pinned' : 'Pin Post'}</span>
          </button>
        </div>

        {/* Right action tools & mobile tab switch */}
        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full sm:w-auto min-w-0">
          <div className="flex md:hidden bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveMobileTab('write')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMobileTab === 'write'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('preview')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMobileTab === 'preview'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('settings')}
              className={`px-2 py-1 rounded transition-colors ${
                activeMobileTab === 'settings'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              Settings
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleDelete}
              className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="Delete article"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(false)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Save Draft"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSave(true)}
              className="px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow transition-all hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>{formPost.published ? 'Update' : 'Publish'}</span>
              <span className="hidden sm:inline">Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Collapsible Cover Image, Excerpt & Pinning Panel */}
      <div className="hidden md:block rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDesktopMeta(!showDesktopMeta)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors"
        >
          <span className="flex items-center gap-2 font-semibold">
            <Settings className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Article Cover Image, Excerpt &amp; Pin Settings</span>
            {formPost.cover_image && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Cover Set
              </span>
            )}
            {formPost.pinned && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30">
                Pinned Above Search
              </span>
            )}
          </span>
          {showDesktopMeta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDesktopMeta && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
            <ImageUploader
              label="Article Cover Image"
              bucket="portfolio-assets"
              folder="blog"
              accept="image/*"
              currentUrl={formPost.cover_image}
              onUploaded={(url) => setFormPost((prev) => ({ ...prev, cover_image: url }))}
              onDeleted={() => setFormPost((prev) => ({ ...prev, cover_image: null }))}
              description="Banner displayed on blog cards, pinned spotlight, and article header"
            />

            <div className="space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-400 font-semibold">
                  Short Excerpt (Card summary &amp; RSS)
                </label>
                <textarea
                  rows={3}
                  value={formPost.excerpt}
                  onChange={(e) => setFormPost((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <input
                  type="checkbox"
                  checked={Boolean(formPost.pinned)}
                  onChange={(e) => setFormPost((prev) => ({ ...prev, pinned: e.target.checked }))}
                  className="w-4 h-4 rounded text-[var(--accent)]"
                />
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                  Pin this article above the search bar on /blog
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Main Studio Body: Desktop Split Grid vs Mobile Tabbed View */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[540px] min-w-0 w-full">
        {/* Left Pane: Editor */}
        <div
          className={`flex flex-col space-y-3 p-4 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm min-w-0 ${
            activeMobileTab === 'write' ? 'flex' : 'hidden md:flex'
          }`}
        >
          <div className="space-y-2 flex-shrink-0 font-mono text-xs">
            <input
              type="text"
              value={formPost.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormPost((prev) => ({
                  ...prev,
                  title,
                  slug:
                    prev.slug === 'untitled-engineering-post'
                      ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      : prev.slug,
                }));
              }}
              placeholder="Article Title..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-[var(--accent)] font-sans shadow-sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={formPost.slug}
                onChange={(e) => setFormPost((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="slug-path"
                className="w-full min-w-0 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-600 dark:text-zinc-400 font-mono focus:outline-none focus:border-[var(--accent)]"
              />
              <input
                type="text"
                value={formPost.tags?.join(', ') || ''}
                onChange={(e) =>
                  setFormPost((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Tags (comma separated)"
                className="w-full min-w-0 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-600 dark:text-zinc-400 font-mono focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {/* Markdown Toolbar */}
          <div className="flex items-center space-x-1 border-y border-zinc-200 dark:border-zinc-800 py-1.5 text-zinc-600 dark:text-zinc-400 text-xs font-mono flex-shrink-0">
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="p-1.5 hover:text-black dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="p-1.5 hover:text-black dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('## ', '')}
              className="p-1.5 hover:text-black dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('```go\n', '\n```')}
              className="p-1.5 hover:text-black dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Code Block"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('> [!NOTE]\n> ', '')}
              className="p-1.5 hover:text-black dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Callout Alert"
            >
              <AlertCircle className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('[', '](https://)')}
              className="p-1.5 hover:text-black dark:hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Link"
            >
              <Link2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={formPost.content_md}
            onChange={(e) => {
              const content = e.target.value;
              setFormPost((prev) => ({
                ...prev,
                content_md: content,
                reading_time: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
              }));
            }}
            placeholder="Write markdown article content here..."
            className="flex-1 w-full bg-transparent font-mono text-xs text-zinc-900 dark:text-zinc-200 resize-none focus:outline-none leading-relaxed min-h-[350px]"
          />
        </div>

        {/* Right Pane: Live Rendered Preview */}
        <div
          className={`p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-y-auto overflow-x-hidden min-w-0 space-y-6 shadow-sm ${
            activeMobileTab === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Live Typography Preview</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Dual-Theme Synced
            </span>
          </div>

          <div className="space-y-4">
            {formPost.cover_image && (
              <ExpandableImage
                src={formPost.cover_image}
                alt={formPost.title || 'Article cover'}
                containerClassName="w-full h-48 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                className="w-full h-full object-cover"
              />
            )}

            <div className="flex flex-wrap items-center gap-2">
              {formPost.pinned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30 font-semibold">
                  <Pin className="w-2.5 h-2.5" /> Pinned
                </span>
              )}
              {formPost.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  #{tag}
                </span>
              ))}
              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1 ml-auto">
                <Clock className="w-3.5 h-3.5" />
                <span>{formPost.reading_time || 3} min read</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight font-sans">
              {formPost.title || 'Untitled Post'}
            </h1>

            {formPost.excerpt && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono leading-relaxed border-l-2 border-[var(--accent)] pl-3 italic">
                {formPost.excerpt}
              </p>
            )}

            <div className="pt-2">
              <MarkdownRenderer content={formPost.content_md} />
            </div>
          </div>
        </div>

        {/* Settings Tab (Mobile Viewport) */}
        <div
          className={`space-y-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 font-mono text-xs min-w-0 ${
            activeMobileTab === 'settings' ? 'block md:hidden' : 'hidden'
          }`}
        >
          <div className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-xs">
            Article Publishing Settings
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-600 dark:text-zinc-400">Short Excerpt (RSS &amp; Meta description)</label>
            <textarea
              rows={3}
              value={formPost.excerpt}
              onChange={(e) => setFormPost((prev) => ({ ...prev, excerpt: e.target.value }))}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <ImageUploader
              label="Article Cover Image"
              bucket="portfolio-assets"
              folder="blog"
              accept="image/*"
              currentUrl={formPost.cover_image}
              onUploaded={(url) => setFormPost((prev) => ({ ...prev, cover_image: url }))}
              onDeleted={() => setFormPost((prev) => ({ ...prev, cover_image: null }))}
              description="Header banner displayed on blog cards & article reader"
            />
          </div>

          <div className="pt-2 space-y-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formPost.pinned)}
                onChange={(e) => setFormPost((prev) => ({ ...prev, pinned: e.target.checked }))}
                className="w-4 h-4 rounded text-[var(--accent)]"
              />
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                Pin article above search bar
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formPost.published}
                onChange={(e) => setFormPost((prev) => ({ ...prev, published: e.target.checked }))}
                className="w-4 h-4 rounded text-[var(--accent)]"
              />
              <span className="text-zinc-800 dark:text-zinc-200 font-semibold">
                Published &amp; visible in public blog list
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Confirmation Modal replacing window.confirm */}
      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={executeDelete}
        title="Delete Article?"
        description={`Are you sure you want to permanently delete "${formPost.title}"? This post will be un-published and erased from Supabase.`}
        confirmLabel="Delete Article"
        variant="danger"
      />
    </div>
  );
}
