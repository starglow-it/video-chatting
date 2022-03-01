import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';

import { AccessTokenController } from './access-token.controller';
import { AccessTokenService } from './access-token.service';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => ({
        secret: await config.get('jwtSecret'),
        signOptions: { expiresIn: JWT_ACCESS_EXPIRE },
      }),
    }),
  ],
  controllers: [AccessTokenController],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
