import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule } from '../../../services/config/config.module';

import { RefreshTokenService } from './refresh-token.service';
import { ConfigClientService } from '../../../services/config/config.service';

import { JWT_REFRESH_EXPIRE } from 'shared';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => ({
        secret: await config.get('jwtSecret'),
        signOptions: { expiresIn: JWT_REFRESH_EXPIRE },
      }),
    }),
  ],
  controllers: [],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
