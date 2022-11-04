import { Expose, Type } from 'class-transformer';
import {
  IRoomsRatingStatistic,
  ICommonTemplate,
  ICommonUser,
} from 'shared-types';

import { UserTemplateDTO } from './user-template.dto';
import { CommonUserDTO } from './common-user.dto';

export class RoomRatingStatisticDTO implements IRoomsRatingStatistic {
  @Expose()
  @Type(() => UserTemplateDTO)
  template: ICommonTemplate;

  @Expose()
  @Type(() => CommonUserDTO)
  user: ICommonUser;

  @Expose()
  transactions: number;

  @Expose()
  minutes: number;

  @Expose()
  calls: number;

  @Expose()
  money: number;

  @Expose()
  uniqueUsers: number;
}
