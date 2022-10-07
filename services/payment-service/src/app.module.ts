import { Module } from '@nestjs/common';
import { ConfigModule } from './services/config/config.module';
import { CoreModule } from './services/core/core.module';
import { NotificationsModule } from './services/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [ConfigModule, CoreModule, NotificationsModule, PaymentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
