import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// modules
import { ConfigModule } from '../../../services/config/config.module';

// services
import { ConfirmTokenService } from './confirm-token.service';
import { ConfigClientService } from '../../../services/config/config.service';

// const
import { JWT_CONFIRM_EXPIRE } from 'shared';

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
  controllers: [],
  exports: [ConfirmTokenService],
})
export class ConfirmTokenModule {}
