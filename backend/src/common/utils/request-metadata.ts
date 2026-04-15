import type { Request } from 'express';

export function getRequestIp(req: Request): string {
  const xfwd = req.headers['x-forwarded-for'];
  const fromHeader = Array.isArray(xfwd) ? xfwd[0] : xfwd;
  const first =
    typeof fromHeader === 'string' ? fromHeader.split(',')[0]?.trim() : undefined;

  return (
    first ||
    // express populates req.ip when trust proxy is set; still a useful fallback
    (typeof req.ip === 'string' && req.ip.trim() ? req.ip.trim() : '') ||
    'unknown'
  );
}

export function getRequestUserAgent(req: Request): string {
  const ua = req.headers['user-agent'];
  if (Array.isArray(ua)) return ua.join(' ');
  if (typeof ua === 'string' && ua.trim()) return ua.trim();
  return 'unknown';
}

