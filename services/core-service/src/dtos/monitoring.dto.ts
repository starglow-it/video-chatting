import { Expose, Transform, Type } from 'class-transformer';
import { IBusinessCategory, IMonitoring, MonitoringEvent } from 'shared-types';

export class MonitoringDto implements IMonitoring {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    event: MonitoringEvent;

    @Expose()
    processTime: string;

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;
}