import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { toNumber } from '../../utils/parsers/toNumber';

export class GetUserTemplateMediasQueryDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  userTemplateId: string;

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
}
