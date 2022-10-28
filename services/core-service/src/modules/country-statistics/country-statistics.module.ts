import { Module } from '@nestjs/common';
import { CountryStatisticsService } from './country-statistics.service';
import {MongooseModule} from "@nestjs/mongoose";
import {CountryStatistic, CountryStatisticSchema} from "../../schemas/country-statistic.schema";
import { CountryStatisticsController } from './country-statistics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CountryStatistic.name, schema: CountryStatisticSchema }]),
  ],
  controllers: [CountryStatisticsController],
  providers: [CountryStatisticsService],
  exports: [
    CountryStatisticsService,
  ]
})
export class CountryStatisticsModule {}
