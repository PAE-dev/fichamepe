import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import type { UserRole } from '../../../users/domain/entities/user';
import {
  FP_REFRESH_COOKIE,
  FP_ROLE_COOKIE,
} from '../constants/auth-cookies.constants';
import { parseEnvDurationToSeconds } from '../utils/parse-env-duration';

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
   * - `AUTH_COOKIE_SAMESITE=lax`: mismo site registrable (ej. fichamepe.com + api.fichamepe.com).
   * - `AUTH_COOKIE_SAMESITE=none`: cross-site explícito (Secure siempre).
   * - Sin variable en `NODE_ENV=production`: por defecto `none` (Vercel + API en otro host p. ej.
   *   Railway); si no, tras F5 el POST /auth/refresh no lleva la cookie con Lax.
   * - Desarrollo: Lax + Secure=false (HTTP local entre puertos suele seguir siendo “same-site”).
   */
  private cookieFlags(): { secure: boolean; sameSite: 'lax' | 'none' } {
    const raw = this.configService
      .get<string>('AUTH_COOKIE_SAMESITE')
      ?.trim()
      .toLowerCase();
    if (raw === 'none') {
      return { sameSite: 'none', secure: true };
    }
    if (raw === 'lax') {
      return {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      };
    }
    if (process.env.NODE_ENV === 'production') {
      return { sameSite: 'none', secure: true };
    }
    return { sameSite: 'lax', secure: false };
  }

  /**
   * CHIPS (`Partitioned`): Chrome/Brave pueden bloquear cookies cross-site sin esto;
   * el front en www y el API en otro host necesitan SameSite=None + Partitioned.
   */
  private cookieOptions(): CookieOptions {
    const { secure, sameSite } = this.cookieFlags();
    const base: CookieOptions = {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
      maxAge: this.refreshMaxAgeMs,
    };
    if (sameSite === 'none' && secure) {
      return { ...base, partitioned: true };
    }
    return base;
  }

  private clearCookieOptions(): CookieOptions {
    const { secure, sameSite } = this.cookieFlags();
    const base: CookieOptions = { path: '/', secure, sameSite };
    if (sameSite === 'none' && secure) {
      return { ...base, partitioned: true };
    }
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
