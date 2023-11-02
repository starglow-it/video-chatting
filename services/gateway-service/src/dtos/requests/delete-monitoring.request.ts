import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';

export class DeleteMonitoringRequestDto {
  @ApiProperty({
    type: Date,
    description: 'This is the timestamp when the object is updated',
  })
  @IsDate({
    message: 'From must be Date',
  })
  @Transform(({ value }) => new Date(value))
  from: Date;
}
