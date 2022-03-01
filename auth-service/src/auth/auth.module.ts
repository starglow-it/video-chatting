import { Module } from '@nestjs/common';

// controllers
import { AuthController } from './auth.controller';

// services
import { AuthService } from './auth.service';

// modules
import { NotificationsModule } from '../notifications/notifications.module';
import { CoreModule } from '../core/core.module';
import { ConfigModule } from '../config/config.module';
import { ConfirmTokenModule } from '../confirm-token/confirm-token.module';
import { AccessTokenModule } from '../access-token/access-token.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Module({
  imports: [
    NotificationsModule,
    CoreModule,
    ConfirmTokenModule,
    ConfigModule,
    AccessTokenModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
