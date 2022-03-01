import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { MeetingsModule } from './meetings/meetings.module';
import { AgoraModule } from './agora/agora.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TemplatesModule } from './templates/templates.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule,
    CoreModule,
    AuthModule,
    MeetingsModule,
    AgoraModule,
    UsersModule,
    NotificationsModule,
    TemplatesModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
