import { Module } from '@nestjs/common';
import { ConfirmTokenController } from './confirm-token.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';
import { JWT_CONFIRM_EXPIRE } from '@shared/const/jwt.const';
import { ConfirmTokenService } from './confirm-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => ({
        secret: await config.get('jwtSecret'),
        signOptions: { expiresIn: JWT_CONFIRM_EXPIRE },
      }),
    }),
  ],
  providers: [ConfirmTokenService],
  controllers: [ConfirmTokenController],
  exports: [ConfirmTokenService],
})
export class ConfirmTokenModule {}
