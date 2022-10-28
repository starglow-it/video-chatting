import { Expose, Transform } from 'class-transformer';
import { ICountryStatistic } from 'shared';

export class CommonCountryStatisticDTO implements ICountryStatistic {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    key: string;

    @Expose()
    value: number;

    @Expose()
    color: string;
}
