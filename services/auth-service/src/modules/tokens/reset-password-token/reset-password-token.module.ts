import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ResetPasswordTokenService } from './reset-password-token.service';
import { ConfigModule } from '../../../services/config/config.module';
import { ConfigClientService } from '../../../services/config/config.service';

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
  controllers: [],
  providers: [ResetPasswordTokenService],
  exports: [ResetPasswordTokenService],
})
export class ResetPasswordTokenModule {}
