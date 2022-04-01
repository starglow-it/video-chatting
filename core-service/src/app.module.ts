import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ConfigClientService } from './config/config.service';

import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { UserTokenModule } from './user-token/user-token.module';
import { MeetingsModule } from './meetings/meetings.module';
import { UserTemplatesModule } from './user-templates/user-templates.module';
import { SeederModule } from './seeder/seeder.module';
import { BusinessCategoriesModule } from './business-categories/business-categories.module';
import { LanguagesModule } from './languages/languages.module';
import { AwsConnectorModule } from './aws-connector/aws-connector.module';
import { CommonTemplatesModule } from './common-templates/common-templates.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';
import { DashboardNotificationsModule } from './dashboard-notifications/dashboard-notifications.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
