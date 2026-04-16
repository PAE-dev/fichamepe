import { Module } from '@nestjs/common';
import { VerificationMailService } from './verification-mail.service';

@Module({
  providers: [VerificationMailService],
  exports: [VerificationMailService],
})
export class MailModule {}
