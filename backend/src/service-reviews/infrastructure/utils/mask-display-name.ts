/** Enmascara el nombre para listados públicos (estilo marketplace). */
export function maskDisplayName(raw: string): string {
  const s = raw.trim();
  if (!s) {
    return 'Usuario';
  }
  if (s.includes('@')) {
    const local = s.split('@')[0] ?? s;
    if (local.length <= 2) {
      return `${local[0] ?? '*'}***`;
    }
    return `${local.slice(0, 2)}***${local.slice(-2)}`;
  }
  const firstWord = s.split(/\s+/)[0] ?? s;
  const w = firstWord.length >= s.length ? s : firstWord;
  if (w.length <= 3) {
    return `${w[0] ?? '*'}***`;
  }
  return `${w.slice(0, 2)}***${w.slice(-2)}`;
}
