import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';
import { VerificationMailService } from '../../../mail/verification-mail.service';

const RESEND_MIN_INTERVAL_MS = 60_000;
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

@Injectable()
export class ResendVerificationEmailUseCase {
  private readonly logger = new Logger(ResendVerificationEmailUseCase.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
    private readonly verificationMail: VerificationMailService,
  ) {}

  async execute(userId: string): Promise<{ message: string }> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (user.emailVerifiedAt) {
      throw new BadRequestException('Tu correo ya está verificado.');
    }
    const lastSent = await this.users.getEmailVerificationLastSentAt(userId);
    if (lastSent) {
      const elapsed = Date.now() - lastSent.getTime();
      if (elapsed < RESEND_MIN_INTERVAL_MS) {
        const retryAfterSec = Math.ceil(
          (RESEND_MIN_INTERVAL_MS - elapsed) / 1000,
        );
        throw new HttpException(
          `Espera ${retryAfterSec} segundos antes de pedir otro correo.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + TOKEN_TTL_MS);
    const sentAt = new Date();
    await this.users.setEmailVerificationByUserId(
      userId,
      token,
      expires,
      sentAt,
    );
    try {
      await this.verificationMail.sendVerificationLink(user.email, token);
    } catch (e) {
      this.logger.error(
        e instanceof Error ? e.message : String(e),
        e instanceof Error ? e.stack : undefined,
      );
      throw new BadRequestException(
        'No pudimos enviar el correo. Revisa la configuración del servidor o inténtalo más tarde.',
      );
    }
    return {
      message:
        'Si no ves el correo en unos minutos, revisa la carpeta de spam.',
    };
  }
}
