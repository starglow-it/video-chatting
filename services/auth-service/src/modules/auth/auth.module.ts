import { Module } from '@nestjs/common';

// controllers
import { AuthController } from './auth.controller';

// services
import { AuthService } from './auth.service';

// modules
import { NotificationsModule } from '../../services/notifications/notifications.module';
import { CoreModule } from '../../services/core/core.module';
import { ConfigModule } from '../../services/config/config.module';
import { RefreshTokenModule } from '../tokens/refresh-token/refresh-token.module';
import { ResetPasswordTokenModule } from '../tokens/reset-password-token/reset-password-token.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    NotificationsModule,
    CoreModule,
    ConfigModule,
    RefreshTokenModule,
    ResetPasswordTokenModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
