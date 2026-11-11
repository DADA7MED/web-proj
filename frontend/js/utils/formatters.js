// js/utils/formatters.js — Shared Formatting Utilities
export function formatMoney(amount, currency = 'USD') {
  const num = Number(amount) || 0;
  return '$' + num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatDate(timestamp, options = {}) {
  if (!timestamp) return '–';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  });
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text, maxLen = 60) {
  if (!text || text.length <= maxLen) return text || '';
  return text.slice(0, maxLen).trim() + '…';
}

export function safeJsonParse(value, fallback = {}) {
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string' && value.trim()) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
}
