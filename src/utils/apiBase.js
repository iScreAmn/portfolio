export function getApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  const trimmed = typeof raw === 'string' ? raw.trim() : '';
  if (!trimmed) return '';
  if (process.env.NODE_ENV !== 'production') {
    try {
      const u = new URL(trimmed);
      const h = u.hostname.toLowerCase();
      if (h === 'localhost' || h === '127.0.0.1') {
        return '';
      }
    } catch {
      /* ignore */
    }
  }
  return trimmed.replace(/\/$/, '');
}
