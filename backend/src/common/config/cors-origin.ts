/**
 * Origen CORS compatible con `credentials: true` (cookies / Authorization).
 * No usar `origin: '*'` con credentials: el navegador lo bloquea.
 *
 * - Sin `CORS_ORIGIN`, vacío o `*`: cualquier dominio (refleja el header Origin).
 * - Un solo URL: ese origen + la variante con/sin `www` (p. ej. apex y www).
 * - Varios separados por coma: solo esos orígenes (sin ampliar www).
 */
export function resolveCorsOrigin(): boolean | string | string[] {
  const raw = process.env.CORS_ORIGIN?.trim();
  if (!raw || raw === '*') {
    return true;
  }
  if (raw.includes(',')) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return expandWwwApexPair(raw);
}

/** Añade `www.` o quita `www.` para un único origen configurado (no aplica a localhost). */
function expandWwwApexPair(origin: string): string | string[] {
  try {
    const u = new URL(origin);
    const host = u.hostname;
    if (!shouldMirrorWww(host)) {
      return origin;
    }
    const base = `${u.protocol}//`;
    const withWww = host.startsWith('www.') ? host : `www.${host}`;
    const withoutWww = host.startsWith('www.') ? host.slice(4) : host;
    const a = `${base}${host}`;
    const b = `${base}${host.startsWith('www.') ? withoutWww : withWww}`;
    return a === b ? [a] : [a, b];
  } catch {
    return origin;
  }
}

function shouldMirrorWww(host: string): boolean {
  if (host === 'localhost' || host.endsWith('.localhost')) {
    return false;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    return false;
  }
  return true;
}
