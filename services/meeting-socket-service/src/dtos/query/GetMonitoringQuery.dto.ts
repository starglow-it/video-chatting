import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { IMonitoring } from 'shared-types';
import { toNumber } from '../../utils/parsers/toNumber';

export class GetMonitoringQueryDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional({
    message: 'atTime must be present',
  })
  @Transform(({ value }) => new Date(value))
  atTime: Date;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toNumber(value, 0))
  skip: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => toNumber(value, 0))
  limit: number;

  @ApiProperty({
    type: String,
    required: false,
    example: 'updatedAt',
  })
  @IsOptional()
  sortProp: keyof Omit<IMonitoring, 'id'>;
}
