import { randomBytes } from 'crypto';

const ALPHANUM = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateReferralCode(length = 10): string {
  const bytes = randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHANUM[bytes[i]! % ALPHANUM.length]!;
  }
  return out;
}
