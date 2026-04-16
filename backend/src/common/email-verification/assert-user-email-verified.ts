import { ForbiddenException } from '@nestjs/common';
import type { User } from '../../users/domain/entities/user';
import { UserRole } from '../../users/domain/entities/user';

export function assertUserEmailVerified(
  user: Pick<User, 'emailVerifiedAt' | 'role'>,
): void {
  if (user.role === UserRole.Admin) {
    return;
  }
  if (!user.emailVerifiedAt) {
    throw new ForbiddenException(
      'Verifica tu correo para publicar o conversar. Revisa tu bandeja de entrada o spam.',
    );
  }
}
