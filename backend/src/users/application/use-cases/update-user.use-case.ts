import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories';
import type { UserUpdatePatch } from '../../domain/repositories/user.repository.interface';
import type { SafeUser } from '../../domain/entities';
import { USER_REPOSITORY } from '../../users.di-tokens';
import type { UpdateUserBodyDto } from '../dto/update-user.dto';

export interface UpdateUserCommand {
  targetUserId: string;
  actorUserId: string;
  patch: UpdateUserBodyDto;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<SafeUser> {
    if (command.targetUserId !== command.actorUserId) {
      throw new ForbiddenException();
    }
    const existing = await this.users.findById(command.targetUserId);
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (
      command.patch.role !== undefined ||
      command.patch.isPro !== undefined ||
      command.patch.proExpiresAt !== undefined ||
      command.patch.tokenBalance !== undefined
    ) {
      throw new BadRequestException(
        'No puedes modificar esos datos de cuenta desde aquí',
      );
    }

    const patch: UserUpdatePatch = {};

    if (command.patch.email !== undefined) {
      const other = await this.users.findByEmail(command.patch.email);
      if (other && other.id !== command.targetUserId) {
        throw new ConflictException('El correo ya está registrado');
      }
      patch.email = command.patch.email;
    }
    if (command.patch.fullName !== undefined) {
      patch.fullName = command.patch.fullName;
    }
    if (command.patch.isActive !== undefined) {
      if (command.patch.isActive === false) {
        patch.isActive = false;
      } else if (command.patch.isActive === true && !existing.isActive) {
        throw new ForbiddenException(
          'No puedes reactivar la cuenta desde aquí; escribe a soporte.',
        );
      }
    }

    if (Object.keys(patch).length === 0) {
      const { password: _p, ...safe } = existing;
      return safe;
    }

    const updated = await this.users.update(command.targetUserId, patch);
    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { password: _p, ...safe } = updated;
    return safe;
  }
}
