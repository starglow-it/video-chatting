import { Expose, Transform } from 'class-transformer';
import { IMonitoring, MonitoringEvent } from 'shared-types';

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
