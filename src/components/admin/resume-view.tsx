'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Save,
  Download,
  Loader2,
  FileText,
  Edit3,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  List,
  Bold,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import { updateSiteProfileAction } from '@/lib/actions/admin-actions';
import { generateResumePdf } from '@/lib/generate-resume-pdf';
import type { SiteProfile } from '@/lib/types';

interface ResumeViewProps {
  initialProfile: SiteProfile;
}

export function ResumeView({ initialProfile }: ResumeViewProps) {
  const [resumeMd, setResumeMd] = useState<string>(initialProfile.resume_md || '');
  const [mobileTab, setMobileTab] = useState<'write' | 'preview'>('write');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end) || 'Text';
    const next = text.substring(0, start) + prefix + selected + suffix + text.substring(end);
    setResumeMd(next);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 30);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSiteProfileAction({ resume_md: resumeMd });
      toast.success('Resume / CV saved! Both the live modal and PDF download are updated.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestPdf = async () => {
    if (!resumeMd.trim()) {
      toast.error('Write some resume content first before downloading PDF');
      return;
    }
    setIsGeneratingPdf(true);
    try {
      await generateResumePdf(resumeMd, initialProfile.full_name);
      toast.success('Downloaded preview PDF!');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[var(--accent)]" />
            <span>Dynamic Resume / CV Studio</span>
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Write in Markdown or plain text &mdash; updates the public Resume modal &amp; auto-generates the downloadable PDF on click
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            disabled={isGeneratingPdf}
            onClick={handleTestPdf}
            className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent)]" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[var(--accent)]" />
            )}
            <span>Test PDF Download</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-4 py-2 rounded-xl font-semibold text-black flex items-center gap-1.5 shadow-md hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tabs Switcher */}
      <div className="flex lg:hidden items-center gap-2 font-mono text-xs bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setMobileTab('write')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'write'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-sm'
              : 'text-zinc-500'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Write</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'preview'
              ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-sm'
              : 'text-zinc-500'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Split-Pane Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Pane: Markdown / Plain-Text Editor */}
        <div
          className={`rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col ${
            mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Formatting Toolbar */}
          <div className="px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertSnippet('# ', '')}
                title="Title / Name (H1)"
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Heading1 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n## ', '')}
                title="Section Heading (H2)"
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Heading2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n### ', '')}
                title="Role / Institution (H3)"
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Heading3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('**', '**')}
                title="Bold"
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n- ', '')}
                title="Bullet point"
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertSnippet('\n---\n', '')}
                title="Horizontal Divider"
                className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-[10px] font-mono text-zinc-500">
              Markdown or Plain Text &bull; {resumeMd.length} chars
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={resumeMd}
            onChange={(e) => setResumeMd(e.target.value)}
            rows={26}
            placeholder="# OLEHI DAVIS&#10;Senior Software Engineer&#10;&#10;## Summary&#10;Type your resume in Markdown or plain text..."
            className="w-full min-h-[540px] p-4 bg-white dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100 font-mono text-xs leading-relaxed focus:outline-none resize-y"
          />
        </div>

        {/* Right Pane: Live Document Preview */}
        <div
          className={`rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col ${
            mobileTab === 'write' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between font-mono text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Live Modal &amp; PDF Preview</span>
            </span>
            <span>Auto-Syncs on Save</span>
          </div>

          <div className="p-6 sm:p-8 min-h-[540px] max-h-[680px] overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
            {resumeMd.trim() ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent)] pt-4 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white pt-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1 text-zinc-600 dark:text-zinc-400">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1 text-zinc-600 dark:text-zinc-400">
                      {children}
                    </ol>
                  ),
                  hr: () => <hr className="border-zinc-200 dark:border-zinc-800 my-3" />,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-zinc-900 dark:text-white">{children}</strong>
                  ),
                }}
              >
                {resumeMd}
              </ReactMarkdown>
            ) : (
              <div className="py-20 text-center font-mono text-xs text-zinc-400">
                Start typing in the editor to preview your live Resume / CV here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
