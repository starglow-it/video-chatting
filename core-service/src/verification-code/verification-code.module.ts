import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { VerificationCodeService } from './verification-code.service';
import {
  VerificationCode,
  VerificationCodeSchema,
} from '../schemas/verification-code.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: VerificationCode.name,
        schema: VerificationCodeSchema,
      },
    ]),
  ],
  providers: [VerificationCodeService],
  exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
