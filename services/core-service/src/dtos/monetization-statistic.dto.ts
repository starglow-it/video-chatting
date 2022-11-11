import { Expose } from 'class-transformer';
import { IMonetizationStatistic } from 'shared-types';

export class MonetizationStatisticDTO implements IMonetizationStatistic {
  @Expose()
  key: string;

  @Expose()
  value: number;

  @Expose()
  type: string;
}
