import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

// services
import { ConfigClientService } from './services/config/config.service';

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
import {TranscodeModule} from "./modules/transcode/transcode.module";
import {TemplateSoundModule} from "./modules/template-sound/template-sound.module";

@Module({
  imports: [
    ConfigModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => {
        const allConfig = await config.getAll();

        return {
          uri: allConfig.mongoUri,
        };
      },
    }),
    UsersModule,
    UserTokenModule,
    MeetingsModule,
    UserTemplatesModule,
    CommonTemplatesModule,
    SeederModule,
    BusinessCategoriesModule,
    LanguagesModule,
    AwsConnectorModule,
    VerificationCodeModule,
    DashboardNotificationsModule,
    PaymentsModule,
    CountryStatisticsModule,
    RoomsStatisticsModule,
    TranscodeModule,
    TemplateSoundModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
