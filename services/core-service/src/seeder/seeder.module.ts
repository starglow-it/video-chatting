import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserTemplatesModule } from '../modules/user-templates/user-templates.module';
import { UsersModule } from '../modules/users/users.module';
import { LanguagesModule } from '../modules/languages/languages.module';
import { BusinessCategoriesModule } from '../modules/business-categories/business-categories.module';
import { CommonTemplatesModule } from '../modules/common-templates/common-templates.module';
import { AwsConnectorModule } from '../services/aws-connector/aws-connector.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PreviewImage,
  PreviewImageSchema,
} from '../schemas/preview-image.schema';
import { PaymentsModule } from '../services/payments/payments.module';
import { CountersModule } from '../modules/counters/counters.module';
import { MonetizationStatisticModule } from '../modules/monetization-statistic/monetization-statistic.module';
import { RoomsStatisticsModule } from '../modules/rooms-statistics/rooms-statistics.module';

@Module({
  imports: [
    CommonTemplatesModule,
    UsersModule,
    UserTemplatesModule,
    BusinessCategoriesModule,
    LanguagesModule,
    PaymentsModule,
    AwsConnectorModule,
    CountersModule,
    MonetizationStatisticModule,
    RoomsStatisticsModule,
    MongooseModule.forFeature([
      { name: PreviewImage.name, schema: PreviewImageSchema },
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
