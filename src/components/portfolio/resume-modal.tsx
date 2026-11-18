'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText, Download, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateResumePdf } from '@/lib/generate-resume-pdf';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeMd?: string | null;
  resumeUrl?: string | null;
  fullName?: string;
}

export function ResumeModal({
  isOpen,
  onClose,
  resumeMd,
  resumeUrl,
  fullName = 'Olehi Davis',
}: ResumeModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const hasDynamicResume = Boolean(resumeMd && resumeMd.trim().length > 0);

  const trackDownload = () => {
    fetch('/api/resume-downloads', { method: 'POST' }).catch(() => {});
  };

  const handleDownload = async () => {
    if (hasDynamicResume && resumeMd) {
      setIsGenerating(true);
      try {
        await generateResumePdf(resumeMd, fullName);
        trackDownload();
        toast.success('Generated and downloaded your latest Resume PDF!');
      } catch (err) {
        toast.error(
          `Could not generate PDF: ${err instanceof Error ? err.message : 'Unknown error'}`
        );
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    if (resumeUrl) {
      trackDownload();
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening Resume PDF...');
      return;
    }

    toast.error('No resume content has been configured in Admin CMS yet.');
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
            <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
              {fullName} &mdash; Resume / CV
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Building PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-black dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Dynamic Document Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">
          {hasDynamicResume ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[var(--accent)] pt-4 pb-1.5 border-b border-zinc-200 dark:border-zinc-800">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white pt-2">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
                    {children}
                  </ol>
                ),
                hr: () => <hr className="border-zinc-200 dark:border-zinc-800 my-4" />,
                strong: ({ children }) => (
                  <strong className="font-semibold text-zinc-900 dark:text-white">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {resumeMd || ''}
            </ReactMarkdown>
          ) : (
            <div className="py-12 text-center font-mono text-xs text-zinc-500">
              Resume content not yet set. Configure it in Admin CMS &rarr; Resume / CV Studio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
