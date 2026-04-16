import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationMailService {
  private readonly logger = new Logger(VerificationMailService.name);

  constructor(private readonly config: ConfigService) {}

  private frontendBaseUrl(): string {
    const raw =
      this.config.get<string>('FRONTEND_URL')?.trim() ||
      'http://localhost:3000';
    return raw.replace(/\/$/, '');
  }

  /**
   * Envía el enlace de verificación vía Resend. Sin `RESEND_API_KEY` solo registra el enlace (útil en local).
   */
  async sendVerificationLink(toEmail: string, token: string): Promise<void> {
    const verifyUrl = `${this.frontendBaseUrl()}/verificar-correo?token=${encodeURIComponent(token)}`;
    const apiKey = this.config.get<string>('RESEND_API_KEY')?.trim();
    const from =
      this.config.get<string>('MAIL_FROM')?.trim() || 'onboarding@resend.dev';

    if (!apiKey) {
      this.logger.warn(
        `RESEND_API_KEY no configurada; enlace de verificación para ${toEmail}: ${verifyUrl}`,
      );
      return;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [toEmail.trim().toLowerCase()],
        subject: 'Verifica tu correo en fichame.pe',
        html: this.buildHtml(verifyUrl),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      this.logger.error(
        `Resend falló (${res.status}): ${text.slice(0, 500)}`,
      );
      throw new Error('No se pudo enviar el correo de verificación');
    }
  }

  private buildHtml(verifyUrl: string): string {
    const esc = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const safeUrl = esc(verifyUrl);
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verifica tu correo</title>
</head>
<body style="margin:0;padding:24px 12px;background:#f4f2fb;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1f2937;line-height:1.55;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;">
    <tr>
      <td style="padding:0 0 20px;text-align:center;">
        <span style="font-size:20px;font-weight:700;letter-spacing:-0.02em;color:#5b21b6;">fichame.pe</span>
      </td>
    </tr>
    <tr>
      <td style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);border:1px solid #e9e4f5;">
        <div style="height:4px;background:linear-gradient(90deg,#6c3aed 0%,#8b5cf6 50%,#a78bfa 100%);"></div>
        <div style="padding:28px 28px 8px;">
          <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#111827;letter-spacing:-0.02em;">Confirma tu correo</h1>
          <p style="margin:0 0 16px;font-size:15px;color:#4b5563;">Hola,</p>
          <p style="margin:0 0 24px;font-size:15px;color:#4b5563;">
            Activa tu cuenta para <strong style="color:#374151;">publicar servicios</strong> y <strong style="color:#374151;">escribir en conversaciones</strong> en fichame.pe.
          </p>
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
            <tr>
              <td style="border-radius:999px;background:linear-gradient(135deg,#6c3aed,#8b5cf6);">
                <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">
                  Verificar correo
                </a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Si el botón no funciona, copia y pega este enlace en el navegador:</p>
          <p style="margin:0 0 24px;font-size:12px;word-break:break-all;color:#6c3aed;">${safeUrl}</p>
          <p style="margin:0;padding:16px 0 0;border-top:1px solid #f3f4f6;font-size:12px;color:#9ca3af;">
            Si no creaste una cuenta en fichame.pe, puedes ignorar este mensaje con tranquilidad.
          </p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 8px 0;text-align:center;font-size:11px;color:#9ca3af;">
        © fichame.pe · Marketplace de habilidades en Perú
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
  }
}
