import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';
import type { ForgotPasswordDto } from '../dto/forgot-password.dto';

export type RequestPasswordResetResult = {
  message: string;
  /** Solo fuera de producción (o PASSWORD_RESET_DEV_LINK), si el correo existía. El front permite elegir contraseña en el mismo flujo. */
  resetToken?: string;
};

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
    private readonly config: ConfigService,
  ) {}

  async execute(dto: ForgotPasswordDto): Promise<RequestPasswordResetResult> {
    const email = dto.email.trim().toLowerCase();
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const updated = await this.users.setPasswordResetByEmail(email, token, expires);

    const nodeEnv = (this.config.get<string>('NODE_ENV') ?? '').trim();
    const exposeToken =
      nodeEnv !== 'production' ||
      ['1', 'true', 'yes'].includes(
        String(this.config.get<string>('PASSWORD_RESET_DEV_LINK') ?? '')
          .trim()
          .toLowerCase(),
      );

    return {
      message:
        'Si hay una cuenta con ese correo, puedes restablecer tu contraseña. Revisa también la carpeta de spam.',
      ...(exposeToken && updated ? { resetToken: token } : {}),
    };
  }
}
