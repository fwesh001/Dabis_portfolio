'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, FileCode, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ExpandableImage } from '@/components/ui/image-lightbox';

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function CodeBlock({ inline, className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');

  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  // Default inferred filenames
  const inferredFilename = language === 'go' ? 'pkg/idempotency/middleware.go'
    : language === 'ts' || language === 'typescript' ? 'src/lib/cache/distributed-lock.ts'
    : language === 'sql' ? 'supabase/migrations/001_initial_schema.sql'
    : null;

  if (inline) {
    return (
      <code className="px-1.5 py-0.5 rounded-md font-mono text-xs bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200">
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = codeString.split('\n');

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 font-mono text-xs shadow-xl">
      {/* Code Header Bar */}
      <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-zinc-400 text-[11px]">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span className="text-zinc-200 font-medium">
            {inferredFilename || `${language} snippet`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-500 uppercase text-[10px]">{language}</span>
          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content with Alternating Line Numbers */}
      <pre className="p-4 overflow-x-auto text-zinc-300 text-[11px] leading-relaxed">
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              <span className="table-cell pr-4 select-none text-zinc-600 text-right w-8">
                {idx + 1}
              </span>
              <span className="table-cell">{line}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const text = String(children);
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            return (
              <h2 id={id} className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-950 dark:text-white pt-6 pb-2 scroll-mt-24 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/80">
                <span className="text-[var(--accent)]">##</span> {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = text
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            return (
              <h3 id={id} className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 pt-4 pb-1 scroll-mt-24">
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300 my-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-1.5 my-3 text-zinc-600 dark:text-zinc-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1.5 my-3 text-zinc-600 dark:text-zinc-400">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/60 border-l-4 border-[var(--accent)] text-xs text-zinc-600 dark:text-zinc-400 not-italic">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) =>
            typeof src === 'string' && src ? (
              <ExpandableImage
                src={src}
                alt={alt || 'Article image'}
                loading="lazy"
                containerClassName="my-4 w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 shadow-sm"
                className="w-full h-auto max-h-[480px] object-cover"
              />
            ) : null,
          code: CodeBlock as any,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
