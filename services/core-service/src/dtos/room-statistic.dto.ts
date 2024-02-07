import { Expose, Transform, Type } from 'class-transformer';
import {
  IRoomsRatingStatistic,
  ICommonTemplate,
  ICommonUser,
} from 'shared-types';

import { CommonUserDTO } from './common-user.dto';
import { CommonTemplateDTO } from './common-template.dto';

export class RoomRatingStatisticDTO implements IRoomsRatingStatistic {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  @Type(() => CommonTemplateDTO)
  template: ICommonTemplate;

  @Expose()
  @Type(() => CommonUserDTO)
  author: ICommonUser;

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