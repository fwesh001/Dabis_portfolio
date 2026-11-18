import { createClient } from './client';

export interface UploadAssetOptions {
  onProgress?: (percent: number) => void;
}

function extractRelativePath(bucket: string, urlOrPath: string): string {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = urlOrPath.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(urlOrPath.slice(idx + marker.length));
  }
  return urlOrPath.replace(/^\/+/, '');
}

export async function uploadAsset(
  bucket: string,
  path: string,
  file: File,
  oldPathToDelete?: string | null,
  options?: UploadAssetOptions
): Promise<{ url: string | null; error: Error | null }> {
  const onProgress = options?.onProgress;
  const supabase = createClient();
  if (!supabase) {
    return { url: null, error: new Error('Supabase client not configured') };
  }

  onProgress?.(5);

  // If replacing an asset, delete the previous file to prevent orphaned storage accumulation
  if (oldPathToDelete && !oldPathToDelete.startsWith('blob:')) {
    try {
      const cleanPath = extractRelativePath(bucket, oldPathToDelete);
      if (cleanPath && !cleanPath.startsWith('http')) {
        await supabase.storage.from(bucket).remove([cleanPath]);
      }
    } catch (err) {
      console.warn('Could not delete old storage asset:', err);
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use XMLHttpRequest when available in browser for real byte-level upload progress
  if (typeof window !== 'undefined' && typeof XMLHttpRequest !== 'undefined' && supabaseUrl && anonKey) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token || anonKey;
      const encodedPath = path
        .split('/')
        .map((segment) => encodeURIComponent(segment))
        .join('/');
      const endpoint = `${supabaseUrl}/storage/v1/object/${bucket}/${encodedPath}`;

      const uploadError = await new Promise<Error | null>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('apikey', anonKey);
        xhr.setRequestHeader('x-upsert', 'true');
        if (file.type) {
          xhr.setRequestHeader('Content-Type', file.type);
        }

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && event.total > 0) {
            const pct = Math.min(95, Math.max(8, Math.round((event.loaded / event.total) * 95)));
            onProgress?.(pct);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress?.(100);
            resolve(null);
          } else {
            let message = `Upload failed with status ${xhr.status}`;
            try {
              const parsed = JSON.parse(xhr.responseText);
              if (parsed?.message || parsed?.error) {
                message = parsed.message || parsed.error;
              }
            } catch {
              // ignore non-JSON body
            }
            resolve(new Error(message));
          }
        };

        xhr.onerror = () => resolve(new Error('Network error during file upload'));
        xhr.onabort = () => resolve(new Error('File upload was aborted'));
        xhr.send(file);
      });

      if (uploadError) {
        return { url: null, error: uploadError };
      }

      const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
      return { url: publicData.publicUrl, error: null };
    } catch (err) {
      return {
        url: null,
        error: err instanceof Error ? err : new Error('Upload failed'),
      };
    }
  }

  // Fallback to standard Supabase SDK upload
  onProgress?.(35);
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) {
    return { url: null, error: new Error(error.message) };
  }

  onProgress?.(100);
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return { url: publicData.publicUrl, error: null };
}

export async function deleteAsset(bucket: string, path: string): Promise<{ success: boolean; error: Error | null }> {
  const supabase = createClient();
  if (!supabase) {
    return { success: false, error: new Error('Supabase client not configured') };
  }

  const cleanPath = extractRelativePath(bucket, path);
  const { error } = await supabase.storage.from(bucket).remove([cleanPath]);
  if (error) {
    return { success: false, error: new Error(error.message) };
  }
  return { success: true, error: null };
}
