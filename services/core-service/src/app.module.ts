import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

// modules
import { UsersModule } from './modules/users/users.module';
import { UserTokenModule } from './modules/user-token/user-token.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { UserTemplatesModule } from './modules/user-templates/user-templates.module';
import { BusinessCategoriesModule } from './modules/business-categories/business-categories.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { CommonTemplatesModule } from './modules/common-templates/common-templates.module';
import { VerificationCodeModule } from './modules/verification-code/verification-code.module';
import { DashboardNotificationsModule } from './modules/dashboard-notifications/dashboard-notifications.module';
import { SeederModule } from './seeder/seeder.module';
import { ConfigModule } from './services/config/config.module';
import { AwsConnectorModule } from './services/aws-connector/aws-connector.module';
import { PaymentsModule } from './services/payments/payments.module';
import { CountryStatisticsModule } from './modules/country-statistics/country-statistics.module';
import { RoomsStatisticsModule } from './modules/rooms-statistics/rooms-statistics.module';
import { TranscodeModule } from './modules/transcode/transcode.module';
import { MediasModule } from './modules/medias/medias.module';
import {
  MediaCategory,
  MediaCategorySchema,
} from './schemas/media-category.schema';
import { Media, MediaSchema } from './schemas/media.schema';
import {
  PreviewImage,
  PreviewImageSchema,
} from './schemas/preview-image.schema';
import { DatabaseModule } from './database/database.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { ResouceModule } from './modules/resouces/resouces.module';
import { MeetingAvatarsModule } from './modules/meeting-avatars/meeting-avatars.module';
import { TemplatePaymentsModule } from './modules/template-payments/template-payments.module';

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    UsersModule,
    UserTokenModule,
    MeetingsModule,
    UserTemplatesModule,
    CommonTemplatesModule,
    SeederModule,
    BusinessCategoriesModule,
    MediasModule,
    LanguagesModule,
    AwsConnectorModule,
    VerificationCodeModule,
    DashboardNotificationsModule,
    PaymentsModule,
    CountryStatisticsModule,
    RoomsStatisticsModule,
    TranscodeModule,
    DatabaseModule,
    ResouceModule,
    MeetingAvatarsModule,
    MonitoringModule,
    TemplatePaymentsModule,
    MongooseModule.forFeature([
      { name: MediaCategory.name, schema: MediaCategorySchema },
      { name: Media.name, schema: MediaSchema },
      { name: PreviewImage.name, schema: PreviewImageSchema },
    ]),
  ],
  providers: [],
})
export class AppModule {}
