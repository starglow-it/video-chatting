import { Expose, Transform, TransformFnParams, Type, TypeHelpOptions, plainToInstance } from 'class-transformer';
import { IBusinessCategory, IMonitoring, MonitoringEvent } from 'shared-types';


export class MonitoringDto implements IMonitoring {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    event: MonitoringEvent;

    @Expose()
    eventId: string;

    @Expose()
    processTime: number;

    @Expose()
    metadata: string;

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;
}