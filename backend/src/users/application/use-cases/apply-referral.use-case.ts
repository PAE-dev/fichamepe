import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories';
import { USER_REPOSITORY } from '../../users.di-tokens';
import { REFERRAL_PUBLICATION_BONUS_CAP } from '../../../common/publication/publication-slots';

@Injectable()
export class ApplyReferralUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: IUserRepository,
  ) {}

  async execute(currentUserId: string, rawCode: string): Promise<{ ok: true }> {
    const code = rawCode.trim().toUpperCase();
    if (!code || code.length < 4) {
      throw new BadRequestException('Código de referido inválido');
    }
    const me = await this.users.findById(currentUserId);
    if (!me) {
      throw new NotFoundException();
    }
    if (me.referredByUserId) {
      throw new BadRequestException(
        'Ya usaste un código de referido. Solo se puede asociar una vez.',
      );
    }
    const referrer = await this.users.findByReferralCode(code);
    if (!referrer) {
      throw new BadRequestException('No encontramos ese código de referido');
    }
    if (referrer.id === currentUserId) {
      throw new BadRequestException('No puedes usar tu propio código');
    }
    const ok = await this.users.applyReferredByIfEmpty(currentUserId, referrer.id);
    if (!ok) {
      throw new BadRequestException(
        'No se pudo aplicar el código. ¿Quizá ya tenías un referidor?',
      );
    }
    await this.users.incrementReferralSlotsEarnedCapped(
      referrer.id,
      REFERRAL_PUBLICATION_BONUS_CAP,
    );
    return { ok: true as const };
  }
}
