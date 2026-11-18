export const DEFAULT_ACCENT_COLOR = '#10B981';

/**
 * Validates a hex color string and converts it to an rgba() string.
 */
export function hexToRgba(hex: string, alpha = 0.15): string {
  const clean = (hex || DEFAULT_ACCENT_COLOR).trim().replace(/^#/, '');
  let fullHex = clean;

  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    fullHex = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }

  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    return `rgba(16, 185, 129, ${alpha})`;
  }

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function sanitizeAccentHex(hex?: string | null): string {
  if (!hex) return DEFAULT_ACCENT_COLOR;
  const trimmed = hex.trim();
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
    return trimmed;
  }
  return DEFAULT_ACCENT_COLOR;
}

export function applyAccentToDocument(hex?: string | null): void {
  if (typeof document === 'undefined') return;
  const safeHex = sanitizeAccentHex(hex);
  document.documentElement.style.setProperty('--accent', safeHex);
  document.documentElement.style.setProperty('--accent-muted', hexToRgba(safeHex, 0.15));
}
