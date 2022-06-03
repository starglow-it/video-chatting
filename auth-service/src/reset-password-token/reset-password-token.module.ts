import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ResetPasswordTokenController } from './reset-password-token.controller';
import { ResetPasswordTokenService } from './reset-password-token.service';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';

import { JWT_RESET_EXPIRE } from '@shared/const/jwt.const';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => ({
        secret: await config.get('jwtSecret'),
        signOptions: { expiresIn: JWT_RESET_EXPIRE },
      }),
    }),
  ],
  controllers: [ResetPasswordTokenController],
  providers: [ResetPasswordTokenService],
  exports: [ResetPasswordTokenService],
})
export class ResetPasswordTokenModule {}
