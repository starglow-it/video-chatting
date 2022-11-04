import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoomsStatisticsController } from './rooms-statistics.controller';
import { RoomsStatisticsService } from './rooms-statistics.service';
import {
  RoomStatistic,
  RoomStatisticSchema,
} from '../../schemas/room-statistic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomStatistic.name, schema: RoomStatisticSchema },
    ]),
  ],
  controllers: [RoomsStatisticsController],
  providers: [RoomsStatisticsService],
  exports: [RoomsStatisticsService],
})
export class RoomsStatisticsModule {}
