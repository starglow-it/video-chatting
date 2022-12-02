import { Module } from '@nestjs/common';
import { UserProfileStatisticController } from './user-profile-statistic.controller';
import { UserProfileStatisticService } from './user-profile-statistic.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserProfileStatistic,
  UserProfileStatisticSchema,
} from '../../schemas/user-profile-statistic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserProfileStatistic.name, schema: UserProfileStatisticSchema },
    ]),
  ],
  controllers: [UserProfileStatisticController],
  providers: [UserProfileStatisticService],
  exports: [UserProfileStatisticService],
})
export class UserProfileStatisticModule {}
