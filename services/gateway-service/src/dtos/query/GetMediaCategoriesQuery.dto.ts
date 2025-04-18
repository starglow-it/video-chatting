import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { MediaCategoryType } from 'shared-types';
import { toNumber } from '../../utils/parsers/toNumber';

export class GetMediaCategoriesQueryDto {
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
    enum: MediaCategoryType,
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  userTemplateId: string;
}
