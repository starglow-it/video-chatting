import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IBusinessCategory, IMonitoring, MonitoringEvent } from 'shared-types';

export class MonitoringDto implements IMonitoring {
    @Expose()
    @ApiProperty()
    id: string;

    @Expose()
    @ApiProperty({
        enum: MonitoringEvent
    })
    event: MonitoringEvent;

    @Expose()
    @ApiProperty()
    eventId: string;

    @Expose()
    @ApiProperty()
    metadata: string;

    @Expose()
    @ApiProperty()
    processTime: number;

    @Expose()
    @ApiProperty({
        type: Date
    })
    createdAt?: Date;

    @Expose()
    @ApiProperty({
        type: Date
    })
    updatedAt?: Date;
}
