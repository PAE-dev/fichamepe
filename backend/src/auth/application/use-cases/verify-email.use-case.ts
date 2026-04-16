import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
  ) {}

  async execute(token: string): Promise<{ message: string }> {
    const trimmed = token.trim();
    if (!trimmed) {
      throw new BadRequestException('Token inválido');
    }
    const ok = await this.users.consumeEmailVerification(trimmed);
    if (!ok) {
      throw new BadRequestException(
        'El enlace de verificación no es válido o ha expirado. Solicita uno nuevo desde tu cuenta.',
      );
    }
    return { message: 'Correo verificado correctamente.' };
  }
}
