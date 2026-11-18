'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';

export type UploadProgressStatus = 'uploading' | 'processing' | 'done' | 'error';

interface UploadProgressBarProps {
  progress: number; // 0 - 100
  fileName?: string;
  status?: UploadProgressStatus;
  className?: string;
}

export function UploadProgressBar({
  progress,
  fileName,
  status = 'uploading',
  className = '',
}: UploadProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  const statusLabel =
    status === 'done'
      ? 'Upload complete'
      : status === 'error'
      ? 'Upload failed'
      : status === 'processing'
      ? 'Finalizing storage URL...'
      : 'Uploading to storage...';

  return (
    <div
      className={`w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-3.5 space-y-2.5 font-mono text-xs ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {status === 'done' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          ) : status === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          ) : (
            <UploadCloud className="w-4 h-4 text-[var(--accent)] animate-pulse flex-shrink-0" />
          )}
          <div className="min-w-0">
            {fileName && (
              <div className="text-zinc-900 dark:text-zinc-100 font-semibold truncate">
                {fileName}
              </div>
            )}
            <div className="text-[10px] text-zinc-500">{statusLabel}</div>
          </div>
        </div>

        <span
          className="text-xs font-bold tabular-nums flex-shrink-0"
          style={{
            color:
              status === 'error'
                ? '#ef4444'
                : status === 'done'
                ? '#10b981'
                : 'var(--accent)',
          }}
        >
          {clamped}%
        </span>
      </div>

      {/* Animated Track & Fill */}
      <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-150 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundColor:
              status === 'error'
                ? '#ef4444'
                : status === 'done'
                ? '#10b981'
                : 'var(--accent)',
          }}
        />
      </div>
    </div>
  );
}
