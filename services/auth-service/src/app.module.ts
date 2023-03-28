import { Module } from '@nestjs/common';

// services
import { NotificationsModule } from './services/notifications/notifications.module';
import { CoreModule } from './services/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokensModule } from './modules/tokens/tokens.module';

@Module({
  imports: [AuthModule, CoreModule, NotificationsModule, TokensModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
