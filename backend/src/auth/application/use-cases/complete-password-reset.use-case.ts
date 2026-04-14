import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { IUserRepository } from '../../../users/domain/repositories';
import { USER_REPOSITORY } from '../../../users/users.di-tokens';
import type { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class CompletePasswordResetUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<void> {
    const hash = await bcrypt.hash(dto.newPassword, 12);
    const ok = await this.users.consumePasswordReset(dto.token.trim(), hash);
    if (!ok) {
      throw new BadRequestException(
        'El enlace de recuperación no es válido o ha caducado. Solicita uno nuevo.',
      );
    }
  }
}
