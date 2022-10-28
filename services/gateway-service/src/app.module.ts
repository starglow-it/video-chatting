import { Module } from '@nestjs/common';
import { ConfigModule } from './services/config/config.module';
import { CoreModule } from './services/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { UsersModule } from './modules/users/users.module';
import { NotificationsModule } from './services/notifications/notifications.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { UploadModule } from './modules/upload/upload.module';
import { ProfileModule } from './modules/profile/profile.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule,
    CoreModule,
    AuthModule,
    MeetingsModule,
    UsersModule,
    NotificationsModule,
    TemplatesModule,
    UploadModule,
    ProfileModule,
    PaymentsModule,
    CategoriesModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
