import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import type { UserRole } from '../../../users/domain/entities/user';
import {
  FP_REFRESH_COOKIE,
  FP_ROLE_COOKIE,
} from '../constants/auth-cookies.constants';
import { parseEnvDurationToSeconds } from '../utils/parse-env-duration';

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
   * Con `AUTH_COOKIE_DOMAIN=.tudominio.com` (API en `api.tudominio.com`, web en `www.tudominio.com`):
   * misma “site” para el navegador → `SameSite=Lax` basta; no hace falta proxy ni cookies raras.
   * Sin dominio (API en `*.railway.app` y web en otro host): en producción `None` + `Partitioned`.
   */
  private cookieShape(): {
    secure: boolean;
    sameSite: 'lax' | 'none';
    domain?: string;
    partitioned?: boolean;
  } {
    const domain = normalizeAuthCookieDomain(
      this.configService.get<string>('AUTH_COOKIE_DOMAIN'),
    );
    if (domain) {
      return {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
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
        secure: process.env.NODE_ENV === 'production',
      };
    }
    if (process.env.NODE_ENV === 'production') {
      return { sameSite: 'none', secure: true, partitioned: true };
    }
    return { sameSite: 'lax', secure: false };
  }

  private cookieOptions(): CookieOptions {
    const { secure, sameSite, domain, partitioned } = this.cookieShape();
    const base: CookieOptions = {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      maxAge: this.refreshMaxAgeMs,
      ...(domain ? { domain } : {}),
      ...(partitioned ? { partitioned: true } : {}),
    };
    return base;
  }

  private clearCookieOptions(): CookieOptions {
    const { secure, sameSite, domain, partitioned } = this.cookieShape();
    const base: CookieOptions = {
      path: '/',
      secure,
      sameSite,
      ...(domain ? { domain } : {}),
      ...(partitioned ? { partitioned: true } : {}),
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
