import { Module } from '@nestjs/common';
import { ConfigModule } from './services/config/config.module';
import { CoreModule } from './services/core/core.module';
import { NotificationsModule } from './services/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SocketModule } from './services/socket/socket.module';

@Module({
  imports: [
    ConfigModule,
    CoreModule,
    NotificationsModule,
    PaymentsModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
