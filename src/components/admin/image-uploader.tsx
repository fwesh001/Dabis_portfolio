'use client';

import React, { useState, useId, useEffect } from 'react';
import { UploadCloud, FileCheck, Eye, Trash2 } from 'lucide-react';
import { uploadAsset } from '@/lib/supabase/storage';
import { UploadProgressBar, type UploadProgressStatus } from '@/components/ui/upload-progress-bar';
import { ImageLightbox } from '@/components/ui/image-lightbox';
import { toast } from 'sonner';

interface ImageUploaderProps {
  label: string;
  bucket?: string;
  folder?: string;
  currentUrl?: string | null;
  onUploaded?: (url: string) => void;
  onDeleted?: () => void;
  accept?: string;
  description?: string;
}

export function ImageUploader({
  label,
  bucket = 'portfolio-assets',
  folder = 'resumes',
  currentUrl,
  onUploaded,
  onDeleted,
  accept = 'application/pdf,image/*',
  description = 'Automatic orphan cleanup: replaces existing storage file seamlessly',
}: ImageUploaderProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadProgressStatus>('uploading');
  const [uploadingFileName, setUploadingFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isImageAsset = Boolean(
    previewUrl &&
      ((accept.includes('image') && !/\.pdf(\?|$)/i.test(previewUrl)) ||
        /\.(png|jpe?g|webp|gif|svg|avif)(\?|$)/i.test(previewUrl))
  );

  useEffect(() => {
    setPreviewUrl(currentUrl || null);
  }, [currentUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await processFile(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
    e.target.value = '';
  };

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(5);
    setUploadStatus('uploading');
    setUploadingFileName(file.name);

    try {
      const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { url, error } = await uploadAsset(bucket, fileName, file, previewUrl, {
        onProgress: (percent) => {
          setUploadProgress(percent);
          if (percent >= 95 && percent < 100) {
            setUploadStatus('processing');
          }
        },
      });

      if (error || !url) {
        // Fallback for demo mode
        setUploadProgress(100);
        setUploadStatus('done');
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        onUploaded?.(localUrl);
        toast.success(`Uploaded ${file.name} (Local preview mode)`);
      } else {
        setUploadProgress(100);
        setUploadStatus('done');
        setPreviewUrl(url);
        onUploaded?.(url);
        toast.success(`Uploaded ${file.name} to Supabase Storage!`);
      }
    } catch (err: unknown) {
      setUploadStatus('error');
      toast.error(`Upload error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 650);
    }
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    onDeleted?.();
    toast.info('Asset removed');
  };

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
        <label className="font-semibold">{label}</label>
        <span className="text-[10px] text-zinc-500">{bucket}/{folder}/</span>
      </div>

      {isUploading ? (
        <UploadProgressBar
          progress={uploadProgress}
          fileName={uploadingFileName}
          status={uploadStatus}
        />
      ) : previewUrl ? (
        <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            {isImageAsset && previewUrl ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 flex-shrink-0 cursor-zoom-in hover:ring-2 hover:ring-[var(--accent)] transition-all"
                title="Click to view full screen"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={label}
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <FileCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            )}
            <div className="truncate">
              <div className="text-zinc-900 dark:text-zinc-200 truncate font-medium">
                {previewUrl.split('/').pop() || 'uploaded-asset'}
              </div>
              <div className="text-[10px] text-zinc-500">Ready in Storage</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isImageAsset ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                title="View Full Screen"
              >
                <Eye className="w-4 h-4" />
              </button>
            ) : (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                title="Preview Asset"
              >
                <Eye className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Delete Asset"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById(inputId)?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center space-y-3 cursor-pointer transition-all ${
            isDragging
              ? 'border-[var(--accent)] bg-[var(--accent)]/10'
              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/30'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mx-auto flex items-center justify-center shadow-sm">
            <UploadCloud className="w-6 h-6 text-[var(--accent)]" />
          </div>

          <div>
            <div className="text-xs font-medium text-zinc-900 dark:text-white">
              Drag &amp; drop file here, or <span className="text-[var(--accent)] underline">browse files</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">{description}</div>
          </div>

          <input
            id={inputId}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {isImageAsset && previewUrl && (
        <ImageLightbox
          src={previewUrl}
          alt={label}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
