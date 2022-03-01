import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
