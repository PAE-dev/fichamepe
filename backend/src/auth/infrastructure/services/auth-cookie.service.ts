import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import type { UserRole } from '../../../users/domain/entities/user';
import {
  FP_REFRESH_COOKIE,
  FP_ROLE_COOKIE,
} from '../constants/auth-cookies.constants';
import { parseEnvDurationToSeconds } from '../utils/parse-env-duration';

/** Normaliza `fichamepe.com` → `.fichamepe.com`. No usar con localhost. */
function normalizeAuthCookieDomain(raw: string | undefined): string | undefined {
  const s = raw?.trim().toLowerCase();
  if (!s || s.includes('localhost')) {
    return undefined;
  }
  return s.startsWith('.') ? s : `.${s}`;
}

@Injectable()
export class AuthCookieService {
  private readonly refreshMaxAgeMs: number;

  constructor(private readonly configService: ConfigService) {
    const sec = parseEnvDurationToSeconds(
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      7 * 24 * 60 * 60,
    );
    this.refreshMaxAgeMs = sec * 1000;
  }

  /**
   * Modo recomendado (www + api bajo el mismo dominio, p. ej. `api.fichamepe.com`):
   * - `AUTH_COOKIE_DOMAIN=.fichamepe.com` en Railway (el punto inicial importa).
   * - `httpOnly: true`, `secure: true` en prod, `sameSite: 'lax'`, **sin** `Partitioned`.
   * El API debe responder con Host `*.fichamepe.com`; si el Host es `*.up.railway.app`,
   * el navegador **no** aceptará `Domain=.fichamepe.com` en Set-Cookie.
   *
   * Sin `AUTH_COOKIE_DOMAIN` y API en otro host: en producción `SameSite=None` + `Partitioned`
   * (menos fiable entre `www` y `*.railway.app`).
   */
  private cookieShape(): {
    secure: boolean;
    sameSite: 'lax' | 'none';
    domain?: string;
    partitioned?: boolean;
  } {
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = normalizeAuthCookieDomain(
      this.configService.get<string>('AUTH_COOKIE_DOMAIN'),
    );
    if (domain) {
      return {
        sameSite: 'lax',
        secure: isProduction,
        domain,
      };
    }

    const raw = this.configService
      .get<string>('AUTH_COOKIE_SAMESITE')
      ?.trim()
      .toLowerCase();
    if (raw === 'none') {
      return { sameSite: 'none', secure: true, partitioned: true };
    }
    if (raw === 'lax') {
      return {
        sameSite: 'lax',
        secure: isProduction,
      };
    }
    if (isProduction) {
      return { sameSite: 'none', secure: true, partitioned: true };
    }
    return { sameSite: 'lax', secure: false };
  }

  private cookieOptions(): CookieOptions {
    const shape = this.cookieShape();
    const base: CookieOptions = {
      httpOnly: true,
      secure: shape.secure,
      sameSite: shape.sameSite,
      path: '/',
      maxAge: this.refreshMaxAgeMs,
      ...(shape.domain ? { domain: shape.domain } : {}),
      ...(shape.partitioned ? { partitioned: true } : {}),
    };
    return base;
  }

  private clearCookieOptions(): CookieOptions {
    const shape = this.cookieShape();
    const base: CookieOptions = {
      path: '/',
      secure: shape.secure,
      sameSite: shape.sameSite,
      ...(shape.domain ? { domain: shape.domain } : {}),
      ...(shape.partitioned ? { partitioned: true } : {}),
    };
    return base;
  }

  setAuthCookies(res: Response, refreshToken: string, role: UserRole): void {
    const opts = this.cookieOptions();
    res.cookie(FP_REFRESH_COOKIE, refreshToken, opts);
    res.cookie(FP_ROLE_COOKIE, role, opts);
  }

  clearAuthCookies(res: Response): void {
    const opts = this.clearCookieOptions();
    res.clearCookie(FP_REFRESH_COOKIE, opts);
    res.clearCookie(FP_ROLE_COOKIE, opts);
  }
}
