import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}

/**
 * Format currency in a compact, user-friendly way
 * Examples: $1.2K, $5.4M, $123
 */
export function formatCompactCurrency(
  value: number,
  options?: { showSign?: boolean }
): string {
  const { showSign = false } = options || {};
  const absValue = Math.abs(value);
  const sign = value >= 0 ? '+' : '-';

  if (absValue >= 1_000_000) {
    return `${showSign ? sign : ''}$${(absValue / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `${showSign ? sign : ''}$${(absValue / 1_000).toFixed(1)}K`;
  }
  return `${showSign ? sign : ''}$${absValue.toFixed(0)}`;
}

/**
 * Format percentage in a clean way (1 decimal max)
 */
export function formatPercent(
  value: number,
  options?: { showSign?: boolean; decimals?: number }
): string {
  const { showSign = false, decimals = 1 } = options || {};
  const sign = value >= 0 ? '+' : '';
  return `${showSign ? sign : ''}${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers compactly
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}
