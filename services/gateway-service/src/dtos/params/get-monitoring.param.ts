import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MonitoringEvent } from 'shared-types';

export class GetMonitoringParam {
  @IsNotEmpty({
    message: 'Event must be present',
  })
  @IsString()
  @ApiProperty({
    enum: MonitoringEvent,
    default: MonitoringEvent.SendEmail
  })
  readonly event: MonitoringEvent;
}